import { Router, Request, Response } from 'express';
import { supabase } from '../db.js';
import { sendWelcomeEmail, sendUnsubscribeConfirmEmail } from '../services/newsletterEmails.js';

const router = Router();

// GET /api/newsletter/verify?token=xxx
router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    return res.status(400).send(page('Invalid link', 'This verification link is missing a token.'));
  }

  const { data: sub, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, full_name, email, status, token')
    .eq('verification_token', token)
    .single();

  if (error || !sub) {
    return res.status(404).send(page('Invalid link', 'This verification link is invalid or has already been used.'));
  }

  if (sub.status === 'active') {
    return res.status(200).send(page('Already verified', "You're already subscribed! Weekly emails are on their way."));
  }

  const { error: updateErr } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'active',
      verification_token: null,
      verified_at: new Date().toISOString(),
    })
    .eq('id', sub.id);

  if (updateErr) {
    return res.status(500).send(page('Error', 'Something went wrong. Please try again.'));
  }

  await sendWelcomeEmail(sub.email, sub.full_name, sub.token);

  return res.redirect('/subscribed.html');
});

// GET /api/newsletter/unsubscribe?token=xxx
router.get('/unsubscribe', async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    return res.status(400).send(page('Invalid link', 'This unsubscribe link is missing a token.'));
  }

  const { data: sub, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, full_name, email, status')
    .eq('token', token)
    .single();

  if (error || !sub) {
    return res.status(404).send(page('Not found', 'We could not find a subscription linked to this link.'));
  }

  if (sub.status === 'unsubscribed') {
    return res.status(200).send(page('Already unsubscribed', `${sub.full_name}, you're already off our list.`));
  }

  const { error: updateErr } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed' })
    .eq('id', sub.id);

  if (updateErr) {
    return res.status(500).send(page('Error', 'We could not process your request. Please try again.'));
  }

  await sendUnsubscribeConfirmEmail(sub.email, sub.full_name);

  return res.redirect('/unsubscribed.html');
});

// POST /api/newsletter/unsubscribe-one-click?token=xxx
router.post('/unsubscribe-one-click', async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) return res.status(200).json({ message: 'ok' });

  const { data: sub } = await supabase
    .from('newsletter_subscribers')
    .select('id, full_name, email, status')
    .eq('token', token)
    .single();

  if (sub && sub.status !== 'unsubscribed') {
    await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('id', sub.id);

    sendUnsubscribeConfirmEmail(sub.email, sub.full_name).catch(console.error);
  }

  return res.status(200).json({ message: 'unsubscribed' });
});

// Branded dark HTML page
function page(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} — Intimacy Fire Ministry</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Georgia,serif;background:#111;
         display:flex;align-items:center;justify-content:center;
         min-height:100vh;padding:24px}
    .card{background:#0F0F0F;border:1px solid #2a2a2a;border-radius:16px;
          padding:52px 44px;max-width:460px;width:100%;text-align:center}
    .brand{font-size:11px;letter-spacing:4px;text-transform:uppercase;
           color:#C9A84C;font-family:Arial,sans-serif;margin-bottom:10px}
    h1{font-size:20px;color:#fff;margin-bottom:20px;font-family:Georgia,serif;}
    p{font-size:15px;color:#888;line-height:1.75;margin-bottom:32px;
      font-family:Arial,sans-serif}
    a{display:inline-block;padding:13px 32px;background:#6B1A2B;
      color:#fff;text-decoration:none;border-radius:8px;
      font-size:15px;font-family:Arial,sans-serif}
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">🔥 &nbsp; Intimacy Fire Ministry</div>
    <h1>${title}</h1>
    <p>${body}</p>
    <a href="/">Return to website</a>
  </div>
</body>
</html>`;
}

export default router;
