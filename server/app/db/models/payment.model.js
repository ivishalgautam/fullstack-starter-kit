"use strict";
import { DataTypes, Deferrable, Op, QueryTypes } from "sequelize";
import sequelize from "sequelize";
import constants from "../../lib/constants/index.js";

let PaymentModel = null;

const init = async (sequelize) => {
  PaymentModel = sequelize.define(
    constants.models.PAYMENT_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.ORDER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      razorpay_payment_id: {
        type: DataTypes.STRING,
        allowNull: true, // filled after payment is done
      },
      amount: {
        type: DataTypes.INTEGER, // in paisa
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "INR",
      },
      payment_status: {
        type: DataTypes.ENUM(
          "pending",
          "created",
          "paid",
          "failed",
          "refunded"
        ),
        defaultValue: "pending",
      },
      receipt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await PaymentModel.sync({ alter: true });
};

// Create a payment record
const create = async (req, transaction = null) => {
  const options = transaction ? { transaction } : {};
  return await PaymentModel.create(
    {
      order_id: req.body.order_id,
      razorpay_order_id: req.body.razorpay_order_id,
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: req.body.receipt,
      payment_status: req.body.payment_status,
    },
    options
  );
};

const update = async (req, razorpay_order_id, transaction = null) => {
  const options = {
    where: { razorpay_order_id },
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return await PaymentModel.update(
    {
      payment_status: req.body.payment_status,
      razorpay_payment_id: req.body.razorpay_payment_id,
    },
    options
  );
};

// Get by order ID
const getByOrderId = async (razorpay_order_id) => {
  return await PaymentModel.findOne({
    where: { razorpay_order_id },
    raw: true,
  });
};

// Optional: Get all payments by user
const getByUserId = async (user_id) => {
  return await PaymentModel.findAll({
    where: { user_id },
    order: [["created_at", "DESC"]],
    raw: true,
  });
};

const getDashboardStats = async () => {
  const [total, paid, failed, revenue] = await Promise.all([
    PaymentModel.count(),
    PaymentModel.count({ where: { payment_status: "paid" } }),
    PaymentModel.count({ where: { payment_status: "failed" } }),
    PaymentModel.sum("amount", { where: { payment_status: "paid" } }),
  ]);

  return {
    total_payments: total,
    successful_payments: paid,
    failed_payments: failed,
    total_revenue: revenue ?? 0,
  };
};

const getTodayRevenue = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const revenueToday = await PaymentModel.sum("amount", {
    where: {
      payment_status: "paid",
      created_at: {
        [Op.between]: [today, tomorrow],
      },
    },
  });

  return revenueToday ?? 0;
};

const getPaymentsOverTime = async () => {
  const results = await PaymentModel.findAll({
    attributes: [
      [
        PaymentModel.sequelize.fn(
          "DATE",
          PaymentModel.sequelize.col("created_at")
        ),
        "date",
      ],
      [
        PaymentModel.sequelize.literal(
          `SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END)`
        ),
        "paid",
      ],
      [
        PaymentModel.sequelize.literal(
          `SUM(CASE WHEN payment_status = 'failed' THEN 1 ELSE 0 END)`
        ),
        "failed",
      ],
    ],
    where: {
      created_at: {
        [Op.gte]: PaymentModel.sequelize.literal(
          "CURRENT_DATE - INTERVAL '7 days'"
        ),
      },
    },
    group: [
      PaymentModel.sequelize.fn(
        "DATE",
        PaymentModel.sequelize.col("created_at")
      ),
    ],
    order: [
      [
        PaymentModel.sequelize.fn(
          "DATE",
          PaymentModel.sequelize.col("created_at")
        ),
        "ASC",
      ],
    ],
    raw: true,
  });

  return results;
};

const getLatestTransactions = async (limit = 10) => {
  const query = `
  SELECT
      pmnt.*,
      usr.id as user_id,
      usr.email as user_email,
      CONCAT(usr.first_name, ' ', usr.last_name) as user_name,
      pln.id as product_id,
      pln.name as plan_name
    FROM ${constants.models.PAYMENT_TABLE} pmnt
    LEFT JOIN ${constants.models.USER_TABLE} usr ON usr.id = pmnt.user_id 
    LEFT JOIN ${constants.models.PLAN_TABLE} pln ON pln.id = pmnt.product_id
    ORDER BY pmnt.created_at DESC
    LIMIT :limit
  `;

  return await PaymentModel.sequelize.query(query, {
    replacements: { limit },
    type: QueryTypes.SELECT,
  });
};

const getStatusBreakdown = async () => {
  const result = await PaymentModel.findAll({
    attributes: [
      "payment_status",
      [sequelize.fn("COUNT", sequelize.col("payment_status")), "count"],
    ],
    group: ["payment_status"],
    raw: true,
  });

  return result.map((r) => ({
    payment_status: r.payment_status,
    value: parseInt(r.count),
  }));
};

export default {
  init: init,
  create: create,
  update: update,
  getByOrderId: getByOrderId,
  getByUserId: getByUserId,
  getDashboardStats: getDashboardStats,
  getTodayRevenue: getTodayRevenue,
  getPaymentsOverTime: getPaymentsOverTime,
  getLatestTransactions: getLatestTransactions,
  getStatusBreakdown: getStatusBreakdown,
};
