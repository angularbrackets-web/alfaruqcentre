import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// POST - Send email via Resend
export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();

    // Validate required fields
    if (!body.to || !body.subject || !body.html) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', message: 'to, subject, and html are required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    const resend = getResend();
    if (!resend) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured', message: 'Please configure RESEND_API_KEY' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Al-Faruq Islamic Centre <noreply@alfaruqcentre.com>',
      to: body.to,
      subject: body.subject,
      html: body.html,
      text: body.text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: data?.id },
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
