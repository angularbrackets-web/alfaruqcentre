import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// For this simple implementation, we'll use a hashed password stored in environment variables
// In production, you'd want to use a more sophisticated auth system
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$12$mLrQ5nXlWPVoe8kyiA4a6uQkIxrzRr0WIjaL73LE6J7K1bFbFTWpW'; // 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password required', message: 'Please enter a password' },
        { status: 400 }
      );
    }

    // Check password against hash
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password', message: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Create a simple session token (in production, use proper JWT or session management)
    const sessionToken = Buffer.from(`${Date.now()}-admin`).toString('base64');
    
    // Set HTTP-only cookie for session
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    });

    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed', message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}