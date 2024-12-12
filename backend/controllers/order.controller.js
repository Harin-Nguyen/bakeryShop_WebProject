import orderModel from "../models/order.model.js";
import userModel from '../models/user.model.js';
import crypto from "crypto";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

const frontend_url = "http://localhost:5173";
const vnpay_return_url = `${frontend_url}/verify`;

const createVNPayUrl = (order, amount) => {
    const vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: process.env.VNP_TMNCODE,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: order._id.toString(),
        vnp_OrderInfo: `Payment for order #${order._id}`,
        vnp_OrderType: "billpayment",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: vnpay_return_url,
        vnp_IpAddr: "127.0.0.1", 
        vnp_CreateDate: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
    };

    const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());

    const signData = querystring.stringify(sortedParams, "&", "=");

    const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    sortedParams.vnp_SecureHash = signed;

    return `${process.env.VNP_URL}?${querystring.stringify(sortedParams)}`;
};

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const vnpUrl = createVNPayUrl(newOrder, req.body.amount);

        res.json({ success: true, payment_url: vnpUrl });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    try {
        const vnp_Params = req.query;
        const secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = querystring.stringify(sortedParams, "&", "=");

        const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const orderId = vnp_Params.vnp_TxnRef;
            const paymentStatus = vnp_Params.vnp_ResponseCode === "00";

            if (paymentStatus) {
                await orderModel.findByIdAndUpdate(orderId, { payment: true });
                res.redirect(`${frontend_url}/verify?success=true&orderId=${orderId}`);
            } else {
                await orderModel.findByIdAndDelete(orderId);
                res.redirect(`${frontend_url}/verify?success=false&orderId=${orderId}`);
            }
        } else {
            res.json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
