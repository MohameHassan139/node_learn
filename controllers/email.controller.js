const asyncWrapper = require('../middleWare/asyncWrapper');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const { sendPriceOfferEmail, sendCertificateEmail } = require('../utils/send_email');

// POST /api/email/price-offer
const sendPriceOffer = asyncWrapper(async (req, res, next) => {
  const { toEmail, clientName, engineerName, total, items } = req.body;

  if (!toEmail || !clientName || !engineerName || total == null || !Array.isArray(items)) {
    return next(appError.createError(400, 'Missing required fields: toEmail, clientName, engineerName, total, items', httpStatusText.ERROR));
  }

  await sendPriceOfferEmail({ toEmail, clientName, engineerName, total, items });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Price offer email sent successfully',
  });
});

// POST /api/email/certificate
const sendCertificate = asyncWrapper(async (req, res, next) => {
  const { toEmail, clientName, engineerName, serialNumber, model, passed, certificateUrl } = req.body;

  if (!toEmail || !clientName || !engineerName || !serialNumber || !model || passed == null || !certificateUrl) {
    return next(appError.createError(400, 'Missing required fields: toEmail, clientName, engineerName, serialNumber, model, passed, certificateUrl', httpStatusText.ERROR));
  }

  await sendCertificateEmail({ toEmail, clientName, engineerName, serialNumber, model, passed, certificateUrl });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Certificate email sent successfully',
  });
});

module.exports = { sendPriceOffer, sendCertificate };
