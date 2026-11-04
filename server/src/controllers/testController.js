import dotenv from "dotenv";
dotenv.config();

import transporter from "../config/mail.js";

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Recipient email ('to') is required in request body",
      });
    }

    const fromAddress = (process.env.EMAIL_USER || "").trim() || "deytaloffice@gmail.com";

    const info = await transporter.sendMail({
      from: `"Abdiva Infotech" <${fromAddress}>`,
      to,
      subject: subject || "Test Email from Abdiva Infotech",
      text: text || "This is a test email sent from the Abdiva Infotech server.",
      html: html || undefined,
    });

    console.log("Email sent successfully to:", to, "MessageId:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
