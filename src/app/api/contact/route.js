import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, service, budget, message, honeypot } = body;

    // Basic honeypot spam protection
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!service || typeof service !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please specify the required service.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'kc659364@gmail.com';
    const senderEmail = process.env.CONTACT_SENDER_EMAIL || 'onboarding@resend.dev';

    // If Resend API key is not configured, inform the user honestly and provide mailto fallback
    if (!resendApiKey) {
      console.warn(
        '[Contact API] RESEND_API_KEY environment variable is not set. Inquiries cannot be dispatched via email without it.'
      );
      return NextResponse.json(
        {
          success: false,
          error:
            'The email delivery service is currently not configured on this server (RESEND_API_KEY missing in .env). Please reach out directly at kc659364@gmail.com or via WhatsApp.',
          fallbackMailto: true,
        },
        { status: 503 }
      );
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    const emailContent = `
New Project Inquiry Received from Portfolio:

Name: ${name.trim()}
Email: ${email.trim()}
Company: ${company ? company.trim() : 'N/A'}
Service Required: ${service}
Approximate Budget: ${budget || 'Not specified'}

Project Details:
---------------------------------------------
${message.trim()}
---------------------------------------------

Sent from: Kartik Chauhan Portfolio Inquiry Form
    `;

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      reply_to: email.trim(),
      subject: `[Portfolio Inquiry] ${service} - from ${name.trim()}`,
      text: emailContent,
    });

    if (error) {
      console.error('[Contact API] Resend email send error:', error);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to send email: ${error.message || 'Unknown error'}. Please email directly at kc659364@gmail.com.`,
          fallbackMailto: true,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been delivered successfully! I will review your requirements and respond shortly.',
      id: data?.id,
    });
  } catch (error) {
    console.error('[Contact API] Unexpected error handling inquiry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing your request. Please email directly at kc659364@gmail.com.',
        fallbackMailto: true,
      },
      { status: 500 }
    );
  }
}
