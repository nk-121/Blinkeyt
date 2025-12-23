const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p style="font-size: 16px; color: #333;">Dear <strong>${name}</strong>,</p>
    
    <p style="font-size: 15px; color: #555;">
      You recently requested to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your account password:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; padding: 12px 24px; font-size: 20px; font-weight: bold; letter-spacing: 3px; background-color: #007bff; color: #fff; border-radius: 6px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 15px; color: #555;">
      ⚠️ This OTP is valid for the next <strong>1 hour</strong>. Please do not share it with anyone.
    </p>

    <p style="font-size: 14px; color: #888;">
      If you didn’t request a password reset, you can safely ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      © ${new Date().getFullYear()} Your Company. All rights reserved.
    </p>
  </div>
  `;
};

export default forgotPasswordTemplate