import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { registerNewSession, checkDeviceLimit } from '@/lib/session-manager';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const session = await getSession(request, res);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.sub;
    const sessionId = uuidv4();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');

    const { canLogin, activeSessions } = await checkDeviceLimit(userId);

    if (!canLogin) {
      return NextResponse.json({
        error: 'Device limit exceeded',
        requiresAction: true,
        activeSessions,
      }, { status: 403 });
    }

    await registerNewSession(userId, sessionId, ipAddress, userAgent);

    return NextResponse.json({ 
      success: true, 
      sessionId,
      message: 'Session registered successfully' 
    });
  } catch (error) {
    console.error('Error registering session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
