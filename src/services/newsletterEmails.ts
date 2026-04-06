import { Resend } from 'resend';
import { env } from '../env.js';
import { supabase } from '../db.js';

const resend = new Resend(env.RESEND_API_KEY);
const FROM_ADDRESS = `Intimacy Fire Ministry <newsletter@${env.EMAIL_DOMAIN}>`;
const BASE_URL = env.BASE_URL;

export async function sendVerificationEmail(
  to: string,
  fullName: string,
  token: string
): Promise<void> {
  const verifyUrl = `${BASE_URL}/api/newsletter/verify?token=${token}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Confirm your subscription — Intimacy Fire Ministry',
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#0F0F0F;border-radius:14px;overflow:hidden;border:1px solid #2a2a2a;">
        <tr>
          <td style="background:linear-gradient(135deg,#6B1A2B 0%,#3d0f19 100%);padding:44px 40px 36px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;">
              🔥 &nbsp; Ministry Newsletter
            </p>
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">
              Intimacy Fire Ministry
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:44px 40px;">
            <h2 style="margin:0 0 18px;font-size:22px;color:#ffffff;font-family:Georgia,serif;">
              Hi ${fullName}, one quick step! 👋
            </h2>
            <p style="margin:0 0 28px;font-size:15px;color:#c0c0c0;line-height:1.8;font-family:Arial,sans-serif;">
              You've requested to join the Intimacy Fire Ministry newsletter.
              Click the button below to confirm your subscription.
            </p>
            <a href="${verifyUrl}"
               style="display:inline-block;background:#6B1A2B;color:white;padding:14px 32px;
                      border-radius:8px;text-decoration:none;font-weight:600;
                      font-family:Arial,sans-serif;font-size:15px;">
              ✅ Confirm My Subscription
            </a>
            <p style="margin:28px 0 0;font-size:13px;color:#666;font-family:Arial,sans-serif;">
              If you didn't sign up, ignore this email — you won't be subscribed.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0a0a0a;padding:20px 40px;border-top:1px solid #1f1f1f;">
            <p style="margin:0;font-size:12px;color:#555;font-family:Arial,sans-serif;text-align:center;">
              © ${new Date().getFullYear()} Intimacy Fire Ministry — Your data is never shared with third parties.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendWelcomeEmail(
  to: string,
  fullName: string,
  token: string
): Promise<void> {
  const unsubUrl = `${BASE_URL}/api/newsletter/unsubscribe?token=${token}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Welcome to Intimacy Fire Ministry, ${fullName} 🔥`,
    headers: {
      'List-Unsubscribe': `<${BASE_URL}/api/newsletter/unsubscribe-one-click?token=${token}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#0F0F0F;border-radius:14px;overflow:hidden;border:1px solid #2a2a2a;">
        <tr>
          <td style="background:linear-gradient(135deg,#6B1A2B 0%,#3d0f19 100%);padding:44px 40px 36px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;">
              🔥 &nbsp; Ministry Newsletter
            </p>
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">
              Intimacy Fire Ministry
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:44px 40px;">
            <h2 style="margin:0 0 18px;font-size:22px;color:#ffffff;font-family:Georgia,serif;">
              You're part of the family, ${fullName} 🙏
            </h2>
            <p style="margin:0 0 20px;font-size:15px;color:#c0c0c0;line-height:1.8;font-family:Arial,sans-serif;">
              Thank you for joining the Intimacy Fire Ministry community.
              You'll start receiving our weekly devotionals, prayer guides, and ministry updates.
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:#888;font-style:italic;
                       border-left:3px solid #6B1A2B;padding-left:16px;font-family:Georgia,serif;">
              "Draw near to God, and He will draw near to you." — James 4:8
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0a0a0a;padding:20px 40px;border-top:1px solid #1f1f1f;">
            <p style="margin:0;font-size:12px;color:#555;font-family:Arial,sans-serif;text-align:center;">
              © ${new Date().getFullYear()} Intimacy Fire Ministry<br/>
              <a href="${unsubUrl}" style="color:#888;text-decoration:underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendUnsubscribeConfirmEmail(
  to: string,
  fullName: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "You've been unsubscribed from Intimacy Fire Ministry",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#0F0F0F;border-radius:14px;overflow:hidden;border:1px solid #2a2a2a;">
        <tr>
          <td style="background:#1a1a1a;padding:32px 40px;border-bottom:1px solid #2a2a2a;text-align:center;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">
              Intimacy Fire Ministry
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 16px;font-size:22px;color:#ffffff;font-family:Georgia,serif;">
              Goodbye for now, ${fullName} 👋
            </h1>
            <p style="font-size:15px;color:#aaa;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 16px;">
              You've been successfully removed from the Intimacy Fire Ministry newsletter.
              You won't receive any further emails from us.
            </p>
            <p style="font-size:15px;color:#aaa;line-height:1.8;font-family:Arial,sans-serif;margin:0;">
              You're always welcome back anytime. 🙏
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0a0a0a;padding:18px 40px;border-top:1px solid #1f1f1f;">
            <p style="margin:0;font-size:12px;color:#555;font-family:Arial,sans-serif;text-align:center;">
              © ${new Date().getFullYear()} Intimacy Fire Ministry
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
