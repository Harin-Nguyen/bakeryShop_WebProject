import userModel from "../models/user.model.js";
import querystring from "qs";
import crypto from "crypto";
import { vnpayConfig } from "../config/vnpayConfig.js";

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const checkoutVNPay = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;

        if (!cartData || Object.keys(cartData).length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }

        const date = new Date();
        const createDate = date.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const orderId = `${createDate}-${userId}`;

        const vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Payment for Order ${orderId}`,
            vnp_OrderType: "billpayment",
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: req.ip,
            vnp_CreateDate: createDate,
        };

        const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = querystring.stringify(sortedParams, { encode: false });
        const secureHash = crypto
            .createHmac("sha512", vnpayConfig.vnp_HashSecret)
            .update(signData)
            .digest("hex");
        sortedParams.vnp_SecureHash = secureHash;

        const paymentUrl = `${vnpayConfig.vnp_Url}?${querystring.stringify(sortedParams)}`;
        res.json({ success: true, paymentUrl });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error creating VNPay payment" });
    }
};

const vnpayReturn = async (req, res) => {
    try {
        const vnp_Params = req.query;

        const secureHash = vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hash = crypto
            .createHmac("sha512", vnpayConfig.vnp_HashSecret)
            .update(signData)
            .digest("hex");

        if (secureHash === hash) {
            const { vnp_ResponseCode, vnp_TxnRef } = vnp_Params;

            if (vnp_ResponseCode === "00") {
                await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
                res.json({ success: true, message: "Payment successful" });
            } else {
                res.json({ success: false, message: "Payment failed" });
            }
        } else {
            res.json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error verifying VNPay payment" });
    }
};

export { addToCart, removeFromCart, getCart, checkoutVNPay, vnpayReturn };
