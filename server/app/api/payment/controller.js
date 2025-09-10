"use strict";
import table from "../../db/models.js";
import { sequelize } from "../../db/postgres.js";
import constants from "../../lib/constants/index.js";
import config from "../../config/index.js";
import crypto from "crypto";

import { razorpay } from "../../config/razorpay.js";
import moment from "moment";
const status = constants.http.status;

const create = async (req, res) => {
  try {
    const productId = req.body.product_id;
    const planRecord = await table.ProductModel.getById(0, productId);
    if (!planRecord)
      return res
        .code(404)
        .send({ status: false, message: "Product not found!" });

    if (!planRecord.is_active)
      return res
        .code(404)
        .send({ status: false, message: "Product not found!" });

    const options = {
      amount: parseInt(planRecord.price) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    await table.PaymentModel.create({
      user_data: { id: req.user_data.id },
      body: {
        product_id: productId,
        razorpay_order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status || "created",
      },
    });

    res.code(status.CREATED).send({ status: true, order });
  } catch (error) {
    throw error;
  }
};

const verify = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const secret = config.razorpay_key_secret;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);

    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      await transaction.commit();
      return res
        .code(status.OK)
        .send({ status: true, message: "Payment verified" });
    } else {
      const paymentRecord =
        await table.PaymentModel.getByOrderId(razorpay_order_id);
      if (!paymentRecord)
        return res
          .code(status.NOT_FOUND)
          .send({ status: false, message: "Payment record not found!" });

      await table.PaymentModel.update(
        { body: { status: "failed" } },
        paymentRecord.razorpay_order_id,
        transaction
      );
      return res
        .code(status.BAD_REQUEST)
        .send({ status: false, message: "Payment not verified" });
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const refund = async (req, res) => {
  try {
    const options = {
      payment_id: req.body.paymentId,
      amount: req.body.amount,
    };
    const razorpayResponse = await razorpay.refunds(options);
    //we can store detail in db and send the response
    res.code(200).send({ status: true, message: "Successfully refunded" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  create: create,
  verify: verify,
  refund: refund,
};
