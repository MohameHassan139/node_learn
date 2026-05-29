const router = require('express').Router();
const emailController = require('../controllers/email.controller');

// POST /api/email/price-offer
router.post('/price-offer', emailController.sendPriceOffer);

module.exports = router;
