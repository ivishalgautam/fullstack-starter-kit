"use strict";
import bookModel from "./models/book.model.js";
import orderItemModel from "./models/order-item.model.js";
import orderModel from "./models/order.model.js";
import otpModel from "./models/otp.model.js";
import paymentModel from "./models/payment.model.js";
import productModel from "./models/product.model.js";
import userModel from "./models/user.model.js";

export default {
  UserModel: userModel,
  OTPModel: otpModel,
  ProductModel: productModel,
  BookModel: bookModel,
  OrderModel: orderModel,
  OrderItemModel: orderItemModel,
  PaymentModel: paymentModel,
};
