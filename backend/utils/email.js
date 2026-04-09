import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"PassManager" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Password Reset OTP",
      html: `
                <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
                    <h2>Password Reset Request</h2>
                    <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; 
                                padding: 16px; background: #f4f4f4; text-align: center; 
                                border-radius: 8px;">
                        ${otp}
                    </div>
                    <p style="color: #888; font-size: 12px; margin-top: 16px;">
                        If you didn't request this, ignore this email.
                    </p>
                </div>
            `,
    });

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};