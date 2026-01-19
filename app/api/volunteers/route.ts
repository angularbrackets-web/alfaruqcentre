import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { VolunteerFormData } from '@/app/types/volunteer';
import { VolunteerStatus } from '@prisma/client';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// Helper function to generate unique ID
function generateId(): string {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}

// Helper function to convert database status to API status
function convertStatus(status: VolunteerStatus): 'pending' | 'contacted' | 'enrolled' | 'declined' {
  const statusMap: Record<VolunteerStatus, 'pending' | 'contacted' | 'enrolled' | 'declined'> = {
    PENDING: 'pending',
    CONTACTED: 'contacted',
    ENROLLED: 'enrolled',
    DECLINED: 'declined'
  };
  return statusMap[status];
}

// Helper to build email HTML
function buildEmailHtml(data: VolunteerFormData): string {
  const areasHtml = data.areasOfInterest.map(area => `<li>${area}</li>`).join('');
  const availabilityHtml = data.availability.map(avail => `<li>${avail}</li>`).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a5f2a;">New Volunteer Registration</h2>
      <p>A new volunteer has registered on the Al-Faruq Islamic Centre website.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone || 'Not provided'}</td>
        </tr>
      </table>

      <h3 style="color: #1a5f2a;">Areas of Interest:</h3>
      <ul>${areasHtml}</ul>

      <h3 style="color: #1a5f2a;">Availability:</h3>
      <ul>${availabilityHtml}</ul>

      <h3 style="color: #1a5f2a;">Message:</h3>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message || 'No message provided'}</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        <a href="https://alfaruqcentre.com/admin/volunteers" style="color: #1a5f2a;">View all volunteers in the admin panel</a>
      </p>
    </div>
  `;
}

// GET - Fetch all volunteers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Build where clause
    const where: { status?: VolunteerStatus } = {};
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter.toUpperCase() as VolunteerStatus;
    }

    // Fetch volunteers from database
    const dbVolunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Convert database format to API format
    const volunteers = dbVolunteers.map(v => ({
      id: v.id,
      name: v.name,
      email: v.email,
      phone: v.phone,
      areasOfInterest: v.areasOfInterest,
      availability: v.availability,
      message: v.message,
      status: convertStatus(v.status),
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new volunteer submission
export async function POST(request: NextRequest) {
  try {
    const body: VolunteerFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.areasOfInterest?.length || !body.availability?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', message: 'Name, email, areas of interest, and availability are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email', message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create new volunteer in database
    const dbVolunteer = await prisma.volunteer.create({
      data: {
        id: generateId(),
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        areasOfInterest: body.areasOfInterest,
        availability: body.availability,
        message: body.message || null,
        status: 'PENDING'
      }
    });

    // Send notification email
    const resend = getResend();
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Al-Faruq Islamic Centre <noreply@alfaruqcentre.com>',
          to: 'info@alfaruqcentre.com',
          subject: `New Volunteer Registration - ${body.name}`,
          html: buildEmailHtml(body),
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the request if email fails - volunteer is already saved
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping email notification');
    }

    // Convert to API format
    const newVolunteer = {
      id: dbVolunteer.id,
      name: dbVolunteer.name,
      email: dbVolunteer.email,
      phone: dbVolunteer.phone,
      areasOfInterest: dbVolunteer.areasOfInterest,
      availability: dbVolunteer.availability,
      message: dbVolunteer.message,
      status: convertStatus(dbVolunteer.status),
      createdAt: dbVolunteer.createdAt.toISOString(),
      updatedAt: dbVolunteer.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newVolunteer,
      message: 'Volunteer registration submitted successfully'
    });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit volunteer registration', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
