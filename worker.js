/**
 * Cloudflare Worker — Contact Form Handler
 * Village Computers LLC
 *
 * Deploy this as a separate Worker (e.g. via the Cloudflare dashboard or
 * `wrangler deploy`). Point WORKER_URL in script.js to this Worker's URL.
 *
 * This Worker accepts a POST with JSON { name, email, phone, message },
 * validates it, and forwards it as an email using the Resend API
 * (https://resend.com — free tier available). Swap the EMAIL SENDING
 * section for any other provider (SendGrid, Mailgun, etc.) if preferred.
 *
 * Required setup (in Cloudflare dashboard -> Worker -> Settings -> Variables):
 *   - RESEND_API_KEY   (secret) - your Resend API key
 *   - TO_EMAIL         - the inbox that should receive form submissions
 *   - FROM_EMAIL       - a verified sender address/domain in Resend
 *   - ALLOWED_ORIGIN   - e.g. https://villagecomputersmtp.com
 */

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { name, email, phone, message } = body;

    // ---- Basic validation ----
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Simple length guards to discourage abuse
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ---- Send email via Resend ----
    const emailBody = {
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      reply_to: email,
      subject: `New contact form submission from ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || 'N/A'}\n\n` +
        `Message:\n${message}`,
    };

    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
      });

      if (!resendResponse.ok) {
        const errText = await resendResponse.text();
        console.error('Resend error:', errText);
        return new Response(JSON.stringify({ error: 'Failed to send message' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
