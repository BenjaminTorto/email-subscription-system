import { Router, Request, Response } from 'express';
import { supabase } from '../db.js';
import { sendVerificationEmail } from '../services/newsletterEmails.js';
import crypto from 'crypto';

const router = Router();

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// POST /subscribe
router.post('/subscribe', async (req: Request, res: Response) => {
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ error: 'Full name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return res.status(409).json({ error: 'This email is already subscribed.' });
      } else {
        const newToken = generateToken();
        await supabase
          .from('newsletter_subscribers')
          .update({ verification_token: newToken })
          .eq('email', email);

        await sendVerificationEmail(email, full_name, newToken);
        return res.status(200).json({
          message: "Almost there! Please check your email to verify.",
        });
      }
    }

    const verificationToken = generateToken();
    const unsubscribeToken = generateToken();

    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        full_name,
        email,
        status: 'pending',
        verification_token: verificationToken,
        token: unsubscribeToken,
      });

    if (dbError) {
      console.error('DB insert error:', dbError);
      return res.status(500).json({ error: 'Failed to save subscription.' });
    }

    await sendVerificationEmail(email, full_name, verificationToken);

    return res.status(201).json({
      message: 'Almost there! Check your inbox and click the link to confirm.',
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
