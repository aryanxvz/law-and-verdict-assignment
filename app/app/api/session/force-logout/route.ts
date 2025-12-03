import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { forceLogoutSession, registerNewSession } from '@/lib/session-manager';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionIdToLogout } = await request.json();

    if (!sessionIdToLogout) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const userId = session.user.sub;

    await forceLogoutSession(sessionIdToLogout, userId);

    const newSessionId = uuidv4();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');
    
    await registerNewSession(userId, newSessionId, ipAddress, userAgent);

    return NextResponse.json({ 
      success: true,
      sessionId: newSessionId,
      message: 'Session forced out successfully' 
    });
  } catch (error) {
    console.error('Error forcing logout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
