// Quick SMTP test — run with: node test-email.mjs
import nodemailer from "nodemailer";

const SMTP_USER = process.env.GMAIL_USER;
const SMTP_PASS = process.env.MAIL_KEY;
const RECIPIENT = process.env.RECIPIENT_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

console.log("Testing SMTP connection...");
try {
  await transporter.verify();
  console.log("✓ SMTP connection OK");

  const info = await transporter.sendMail({
    from: `"Portfolio Test" <${SMTP_USER}>`,
    to: RECIPIENT,
    subject: "[Portfolio] Test Email ✓",
    html: `
      <div style="font-family:monospace;padding:24px;background:#0a0715;color:#e8e0ff;border-radius:12px">
        <h2 style="color:#a066ff;margin:0 0 12px">🚀 SMTP Working!</h2>
        <p>Your portfolio contact form is connected and sending emails.</p>
        <p style="color:#3dff99;font-size:12px">Sent at: ${new Date().toISOString()}</p>
      </div>
    `,
  });

  console.log("✓ Email sent! Message ID:", info.messageId);
  console.log("  Response:", info.response);
} catch (err) {
  console.error("✗ SMTP failed:", err.message);
  if (err.code === "EAUTH") {
    console.error(
      "  → Gmail rejected credentials. Make sure you are using a 16-char App Password,",
    );
    console.error(
      "    NOT your regular Gmail password. Generate at: myaccount.google.com/apppasswords",
    );
  }
  process.exit(1);
}
