import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
  console.error('RESEND_API key is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API);
const sendEmail = async ({ email, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Blinkeyt <onboarding@resend.dev>",  // ✅ works on free tier
      to: email, 
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Send email failed:", err);
    return null;
  }
};

export default sendEmail;


