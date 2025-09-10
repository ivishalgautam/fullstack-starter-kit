"use strict";
import table from "../../db/models.js";
import { sequelize } from "../../db/postgres.js";
import constants from "../../lib/constants/index.js";
import config from "../../config/index.js";
import crypto from "crypto";

import { razorpay } from "../../config/razorpay.js";
import moment from "moment";
import { createOrderSchema } from "../../validation-schema/order-schema.js";
import { StatusCodes } from "http-status-codes";

const create = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const validateData = createOrderSchema.parse(req.body);
    let subtotal = 0;
    let total = 0;

    const bulkOrderItemData = await Promise.all(
      validateData.order_items.forEach(async (item) => {
        if (item.item_type === "book") {
          const bookRecord = await table.BookModel.getById(0, item.item_id);
          subtotal += bookRecord.price * item.quantity;
          total += bookRecord.price * item.quantity;
        }
        if (item.item_type === "product") {
          const productRecord = await table.ProductModel.getById(
            0,
            item.item_id
          );
          subtotal += productRecord.price * item.quantity;
          total += productRecord.price * item.quantity;
        }
      })
    );

    req.body.subtotal = subtotal;
    req.body.total = total;

    // create order
    const orderRecord = await table.OrderModel.create(req, transaction);
    // create payment
    const options = {
      amount: parseInt(planRecord.price) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    await table.PaymentModel.create({
      body: {
        order_id: orderRecord.id,
        razorpay_order_id: order.id,
        amount: total,
        currency: "INR",
        receipt: order.receipt,
        payment_status: order.status || "created",
      },
    });
    // create order item data
    bulkOrderItemData.map((item) => ({ ...item, order_id: orderRecord.id }));
    await table.OrderItemModel.bulkCreate(bulkOrderItemData, transaction);

    await transaction.commit();

    res.code(StatusCodes.CREATED).send({ status: true, order });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

