export const vnpayConfig = {
    vnp_TmnCode: process.env.VNPAY_TMN_CODE,
    vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "http://localhost:5000/api/payment/vnpay_return",
};
