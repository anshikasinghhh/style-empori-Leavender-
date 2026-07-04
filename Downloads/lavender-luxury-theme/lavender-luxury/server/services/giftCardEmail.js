const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendGiftCardEmail = async ({ recipientEmail, recipientName, senderName, giftCode, amount, personalMessage, expiryDate }) => {
  try {
    const transporter = createTransporter();

    const formattedExpiry = new Date(expiryDate).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDF8F0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#6B21A8,#9333EA);padding:32px 40px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;letter-spacing:1px;">Lavender</h1>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;font-style:italic;">The Style Emporio</p>
      </td>
    </tr>
    <!-- Gift Badge -->
    <tr>
      <td style="text-align:center;padding:32px 40px 0;">
        <div style="display:inline-block;background:#F3E8FF;border:1px solid #E9D5FF;border-radius:12px;padding:16px 28px;">
          <p style="margin:0;color:#6B21A8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">You've received a gift card!</p>
        </div>
      </td>
    </tr>
    <!-- Message -->
    <tr>
      <td style="padding:24px 40px;text-align:center;">
        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0;">
          <strong>${senderName}</strong> has sent you a Lavender Gift Card worth
        </p>
        <p style="color:#6B21A8;font-size:40px;font-weight:800;margin:12px 0;">₹${amount.toLocaleString('en-IN')}</p>
        ${personalMessage ? `
        <div style="background:#FAF5FF;border-left:3px solid #9333EA;padding:16px 20px;margin:20px 0;text-align:left;border-radius:0 8px 8px 0;">
          <p style="color:#6B21A8;font-size:12px;font-weight:600;margin:0 0 6px;text-transform:uppercase;">Personal Message</p>
          <p style="color:#4B5563;font-size:14px;line-height:1.5;margin:0;font-style:italic;">"${personalMessage}"</p>
        </div>` : ''}
      </td>
    </tr>
    <!-- Code -->
    <tr>
      <td style="padding:0 40px 24px;text-align:center;">
        <p style="color:#6B7280;font-size:13px;margin:0 0 8px;">Your Gift Card Code</p>
        <div style="background:#F9FAFB;border:2px dashed #D1D5DB;border-radius:12px;padding:16px;display:inline-block;">
          <p style="color:#111827;font-size:28px;font-weight:800;letter-spacing:3px;margin:0;font-family:monospace;">${giftCode}</p>
        </div>
        <p style="color:#9CA3AF;font-size:12px;margin:12px 0 0;">Valid until ${formattedExpiry}</p>
      </td>
    </tr>
    <!-- CTA -->
    <tr>
      <td style="padding:0 40px 32px;text-align:center;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/products" style="display:inline-block;background:linear-gradient(135deg,#6B21A8,#9333EA);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:15px;">Shop Now</a>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #F3F4F6;">
        <p style="color:#9CA3AF;font-size:11px;margin:0;">This gift card is non-refundable and cannot be exchanged for cash.</p>
        <p style="color:#9CA3AF;font-size:11px;margin:4px 0 0;">&copy; ${new Date().getFullYear()} Lavender. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Lavender" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `You've received a ₹${amount.toLocaleString('en-IN')} Lavender Gift Card from ${senderName}!`,
      html: htmlTemplate,
    });

    console.log(`Gift card email sent to ${recipientEmail}`);
    return { success: true };
  } catch (err) {
    console.error('Gift card email error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { sendGiftCardEmail };
