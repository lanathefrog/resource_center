import { getMailer } from "../config/mailer.js";
import { env } from "../config/env.js";

export const emailService = {
  async sendVerificationEmail({ to, firstName, token }) {
    const verificationLink = `${env.clientUrl}/verify-email?token=${encodeURIComponent(token)}`;

    if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
      console.log("SMTP is not configured. Verification link:", verificationLink);
      return { skipped: true, verificationLink };
    }

    const transporter = getMailer();

    const info = await transporter.sendMail({
      from: env.mailFrom,
      to,
      subject: "Verify your Library App account",
      text: [
        `Hi ${firstName},`,
        "",
        "Welcome to Library App.",
        "Please verify your email by opening this link:",
        verificationLink,
        "",
        "If you did not create this account, you can ignore this message."
      ].join("\n"),
      html: `
        <div style="margin:0;padding:24px;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:26px 28px;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#ffffff;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;">Confirm your email address</h1>
                <p style="margin:10px 0 0 0;font-size:14px;opacity:0.95;">Library App account activation</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px 10px 28px;">
                <p style="margin:0 0 12px 0;font-size:16px;">Hi ${firstName},</p>
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#334155;">
                  Thanks for registering in Library App. To finish your signup, please verify your email address.
                </p>
                <p style="margin:0 0 18px 0;">
                  <a href="${verificationLink}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:10px;">
                    Verify email address
                  </a>
                </p>
                <p style="margin:0 0 8px 0;font-size:13px;line-height:1.6;color:#64748b;">
                  If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 18px 0;font-size:12px;line-height:1.7;word-break:break-all;">
                  <a href="${verificationLink}" style="color:#0369a1;text-decoration:underline;">${verificationLink}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px 24px 28px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
                If you did not create an account, you can safely ignore this email.
              </td>
            </tr>
          </table>
        </div>
      `
    });

    return info;
  }
};
