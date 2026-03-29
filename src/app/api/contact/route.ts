import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const smtpUser = process.env.GMAIL_USER ?? "rs8352406@gmail.com";
    const recipient = process.env.RECIPIENT_EMAIL ?? "shivampanjolia8@gmail.com";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: process.env.MAIL_KEY,   // 16-char Google App Password from .env.local
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: recipient,
      replyTo: email,
      subject: `[Portfolio] Message from ${name}`,
      html: `
        <div style="font-family: monospace; background: #0a0715; color: #e8e0ff; padding: 32px; border-radius: 12px; border: 1px solid #a066ff44;">
          <h2 style="color: #a066ff; margin: 0 0 16px;">New contact from portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 80px;">From:</td><td style="color: #fff;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="color: #58d8ff;">${email}</td></tr>
          </table>
          <hr style="border: 1px solid #a066ff22; margin: 16px 0;" />
          <p style="color: #ccc; line-height: 1.6; margin: 0;">${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact route] SMTP error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
