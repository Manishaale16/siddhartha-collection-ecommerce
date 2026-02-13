const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');

// Environment variables
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * @desc    Get eSewa Configuration (V2)
 * @route   POST /api/payment/esewa/config
 * @access  Private
 */
const getEsewaConfig = async (req, res) => {
    try {
        const { orderId, totalAmount } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const amount = totalAmount.toString();
        const transactionUuid = `${orderId}-${Date.now()}`;
        const productCode = ESEWA_PRODUCT_CODE;

        // Signature string: "total_amount=VAL,transaction_uuid=VAL,product_code=VAL"
        const signatureString = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

        const signature = crypto.createHmac('sha256', ESEWA_SECRET_KEY)
            .update(signatureString)
            .digest('base64');

        res.json({
            signature,
            transactionUuid,
            productCode,
            successUrl: `${FRONTEND_URL}/payment/esewa/success`,
            failureUrl: `${FRONTEND_URL}/checkout?payment=failed_esewa`,
        });
    } catch (error) {
        console.error('eSewa Config Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * @desc    Verify Esewa Payment (V2)
 * @route   POST /api/payment/esewa/verify
 * @access  Public (Called by frontend after redirect)
 */
const verifyEsewaPayment = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ success: false, message: "Missing response data" });
        }

        // 1. Decode Response
        const decodedString = Buffer.from(data, 'base64').toString('utf-8');
        const responseData = JSON.parse(decodedString);

        // 2. Validate Status
        if (responseData.status !== 'COMPLETE') {
            return res.status(400).json({
                success: false,
                message: 'Payment was not completed',
                status: responseData.status
            });
        }

        // 3. Verify Signature
        // V2 Response returns signed_field_names. We must use them in order.
        const signedFields = responseData.signed_field_names.split(',');
        const signatureData = signedFields
            .map(field => `${field}=${responseData[field]}`)
            .join(',');

        const localSignature = crypto.createHmac('sha256', ESEWA_SECRET_KEY)
            .update(signatureData)
            .digest('base64');

        if (localSignature !== responseData.signature) {
            console.error("eSewa Signature Mismatch!");
            return res.status(400).json({ success: false, message: 'Signature verification failed' });
        }

        // 4. Map to Order
        const transactionUuid = responseData.transaction_uuid;
        const orderId = transactionUuid.split('-')[0];

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // 5. Amount Verification
        const paidAmount = parseFloat(responseData.total_amount.replace(/,/g, ''));
        if (Math.abs(paidAmount - order.totalPrice) > 1) {
            return res.status(400).json({ success: false, message: 'Amount mismatch' });
        }

        // 6. Update Order
        if (!order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: responseData.transaction_code,
                status: responseData.status,
                update_time: String(Date.now()),
                email_address: order.user ? (await order.populate('user', 'email')).user.email : 'guest@example.com',
            };
            order.status = 'Processing';
            await order.save();
        }

        res.json({
            success: true,
            status: 'Completed',
            order
        });

    } catch (error) {
        console.error('eSewa Verification Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    getEsewaConfig,
    verifyEsewaPayment,
};
