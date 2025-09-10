"use strict";
import Razorpay from "razorpay";
import config from "./index.js";

export const razorpay = new Razorpay({
  key_id: config.razorpay_key_id,
  key_secret: config.razorpay_key_secret,
});
