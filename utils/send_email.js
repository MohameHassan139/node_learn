const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'mohamedhessan139@gmail.com',
    pass: process.env.EMAIL_PASS || 'ybsp kupo wzum qccv',
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(d) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// ── Send password-reset code ──────────────────────────────────────────────────
async function sendEmail(email, code) {
  const mailOptions = {
    from: '"Caliborty – UMECC" <mohamedhessan139@gmail.com>',
    to: email,
    subject: 'Your password reset code',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <title>Password Reset Code</title>
        <style>
          body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
          .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,.1);}
          h1{color:#333;}
          p{color:#555;line-height:1.6;}
          .code{display:inline-block;margin:20px 0;padding:16px 24px;background:#f0f0f0;border-radius:8px;font-size:24px;letter-spacing:4px;font-weight:bold;}
          .footer{margin-top:30px;font-size:12px;color:#aaa;text-align:center;}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset Request</h1>
          <p>Use the code below to reset your password. It is valid for a short time.</p>
          <div class="code">${code}</div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <div class="footer"><p>&copy; 2026 Caliborty – UMECC. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
}

// ── Send price-offer email ────────────────────────────────────────────────────
async function sendPriceOfferEmail({ toEmail, clientName, engineerName, total, items, offerDate }) {
  // Build items rows HTML (same logic as the Dart client)
  let itemsRows = '';
  items.forEach((item, i) => {
    const fp = Number(item.functionPrice || 0).toFixed(0);
    const sp = Number(item.safetyPrice || 0).toFixed(0);
    const sub = Number(item.subtotal || 0).toFixed(0);
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    const funcChecked = item.functionCheck === true;
    const safeChecked = item.safetyCheck === true;
    const funcText = funcChecked ? `&#10004; $${fp}` : '&mdash;';
    const safeText = safeChecked ? `&#10004; $${sp}` : '&mdash;';
    const funcColor = funcChecked ? '#1565C0' : '#90A4AE';
    const safeColor = safeChecked ? '#00897B' : '#90A4AE';
    const funcWeight = funcChecked ? '700' : '400';
    const safeWeight = safeChecked ? '700' : '400';

    itemsRows += `
      <tr style="background:${bg};">
        <td style="padding:11px 16px;color:#0D1B2A;font-size:13px;border-bottom:1px solid #EEF2F8;">${item.name}</td>
        <td style="padding:11px 16px;font-size:13px;border-bottom:1px solid #EEF2F8;text-align:center;color:${funcColor};font-weight:${funcWeight};">${funcText}</td>
        <td style="padding:11px 16px;font-size:13px;border-bottom:1px solid #EEF2F8;text-align:center;color:${safeColor};font-weight:${safeWeight};">${safeText}</td>
        <td style="padding:11px 16px;color:#546E7A;font-size:13px;border-bottom:1px solid #EEF2F8;text-align:center;font-weight:600;">${item.qty}</td>
        <td style="padding:11px 16px;color:#1565C0;font-size:13px;border-bottom:1px solid #EEF2F8;text-align:right;font-weight:700;">$${sub}</td>
      </tr>`;
  });

  // Load HTML template and replace placeholders
  const templatePath = path.join(__dirname, '../views/index.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  const date = offerDate || formatDate(new Date());
  const totalFormatted = `$${Number(total).toFixed(0)}`;

  html = html
    .replace(/\{\{offer_date\}\}/g, date)
    .replace(/\{\{client_name\}\}/g, clientName)
    .replace(/\{\{engineer_name\}\}/g, engineerName)
    .replace(/\{\{total\}\}/g, totalFormatted)
    .replace(/\{\{\{items_rows\}\}\}/g, itemsRows);

  const mailOptions = {
    from: '"Caliborty – UMECC" <mohamedhessan139@gmail.com>',
    to: toEmail,
    subject: `Maintenance Price Offer – ${clientName}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Price offer email sent:', info.messageId);
  return info;
}

module.exports = { sendEmail, sendPriceOfferEmail };
