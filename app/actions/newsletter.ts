import { normalizeEmail, validateEmail } from '@/lib/email';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { Resend } from 'resend';

// initialize resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Resend Audience ID
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;

// initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const REDIS_RATE_LIMIT_KEY = process.env.UPSTASH_REDIS_NEWSLETTER_RATE_LIMIT_KEY!;
const DAY_MAX_SUBMISSIONS = parseInt(process.env.DAY_MAX_SUBMISSIONS || '10');

// create rate limiter
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(DAY_MAX_SUBMISSIONS, '1d'),
  prefix: REDIS_RATE_LIMIT_KEY,
});

// Shared rate limit check
async function checkRateLimit() {
  const headersList = await headers();
  const ip = headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for') ||
    'unknown';

  const { success } = await limiter.limit(ip);
  if (!success) {
    throw new Error('Too many submissions, please try again later');
  }
}

export async function subscribeToNewsletter(email: string) {
  try {
    await checkRateLimit();

    const normalizedEmail = normalizeEmail(email);
    const { isValid, error } = validateEmail(normalizedEmail);

    if (!isValid) {
      throw new Error(error || 'Invalid email address');
    }

    // Check if already subscribed
    // const list = await resend.contacts.list({ audienceId: AUDIENCE_ID });
    // const user = list.data?.data.find((item) => item.email === normalizedEmail);
    // if (user) {
    //   return { success: true, alreadySubscribed: true };
    // }

    // Add to audience
    await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email: normalizedEmail,
    });

    // Send welcome email
    const unsubscribeToken = Buffer.from(normalizedEmail).toString('base64');
    const unsubscribeLink = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${unsubscribeToken}`;

    await resend.emails.send({
      from: 'NextForge <' + process.env.ADMIN_EMAIL! + '>',
      to: normalizedEmail,
      subject: 'Welcome to Next Forge',
      html: `
        <h2>Welcome to Next Forge</h2>
        <p>Thank you for subscribing to the newsletter. You will receive the latest updates and news.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          If you wish to unsubscribe, please <a href="${unsubscribeLink}">click here</a>
        </p>
      `,
      headers: {
        "List-Unsubscribe": `<${unsubscribeLink}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    throw error;
  }
}

export async function unsubscribeFromNewsletter(token: string) {
  try {
    await checkRateLimit();

    const email = Buffer.from(token, 'base64').toString();
    const normalizedEmail = normalizeEmail(email);
    const { isValid, error } = validateEmail(normalizedEmail);

    if (!isValid) {
      throw new Error(error || 'Invalid email address');
    }

    // Check if subscribed
    const list = await resend.contacts.list({ audienceId: AUDIENCE_ID });
    const user = list.data?.data.find((item) => item.email === normalizedEmail);

    if (!user) {
      throw new Error('This email is not subscribed to our notifications');
    }

    // Remove from audience
    await resend.contacts.remove({
      audienceId: AUDIENCE_ID,
      email: normalizedEmail,
    });

    return { success: true, email: normalizedEmail };
  } catch (error) {
    console.error('Newsletter unsubscribe failed:', error);
    throw error;
  }
} 