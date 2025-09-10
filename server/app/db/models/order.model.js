// models/order.js
"use strict";
import { DataTypes, Deferrable } from "sequelize";
import constants from "../../lib/constants/index.js";

let OrderModel = null;

const init = async (sequelize) => {
  OrderModel = sequelize.define(
    constants.models.ORDER_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.USER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      order_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      tax: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      shipping_fee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      shipping_address: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      billing_address: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      order_status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "returned"
        ),
        defaultValue: "pending",
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await OrderModel.sync({ alter: true });
};

const create = async (req, transaction) => {
  const latest = await OrderModel.findOne({
    attributes: ["order_number"],
    order: [["created_at", "DESC"]],
    raw: true,
  });

  let newOrderNo = "ORD-0001";
  if (latest?.order_number) {
    const number = parseInt(latest.order_number.split("-")[1]);
    const nextNumber = number + 1;
    newOrderNo = `ORD-${String(nextNumber).padStart(4, "0")}`;
  }

  const options = {};
  if (transaction) options.transaction = transaction;
  const { role, id } = req.user_data;
  const userId = role === "user" ? id : req.body.user_id;

  const data = await OrderModel.create(
    {
      user_id: userId,
      order_number: newOrderNo,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      shipping_fee: req.body.shipping_fee,
      total: req.body.total,
      shipping_address: req.body.shipping_address,
      billing_address: req.body.billing_address,
      order_status: req.body.order_status,
    },
    options
  );

  return data.dataValues;
};

const update = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await OrderModel.update(
    { order_status: req.body.order_status },
    options
  );
};

export default {
  init: init,
  create: create,
  update: update,
};
