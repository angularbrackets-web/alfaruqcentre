import { NextRequest, NextResponse } from 'next/server';

// Simple session verification
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, isAuthenticated: false, message: 'No session found' },
        { status: 401 }
      );
    }

    // Decode and verify the session token
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString();
      const [timestamp, role] = decoded.split('-');
      
      // Check if session is still valid (24 hours)
      const sessionTime = parseInt(timestamp);
      const currentTime = Date.now();
      const sessionAge = currentTime - sessionTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxAge || role !== 'admin') {
        return NextResponse.json(
          { success: false, isAuthenticated: false, message: 'Session expired' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        message: 'Session valid'
      });

    } catch {
      return NextResponse.json(
        { success: false, isAuthenticated: false, message: 'Invalid session token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed', message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}