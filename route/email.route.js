const router = require('express').Router();
const emailController = require('../controllers/email.controller');

// POST /api/email/price-offer
router.post('/price-offer', emailController.sendPriceOffer);

// POST /api/email/certificate
router.post('/certificate', emailController.sendCertificate);

module.exports = router;
