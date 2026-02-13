const express = require('express');
const router = express.Router();
const {
    getEsewaConfig,
    verifyEsewaPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/esewa/config', protect, getEsewaConfig);
router.post('/esewa/verify', verifyEsewaPayment); // Public for redirect verification

module.exports = router;
