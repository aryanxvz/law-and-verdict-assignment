import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { checkDeviceLimit } from '@/lib/session-manager';

export async function GET(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const session = await getSession(request, res);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await checkDeviceLimit(session.user.sub);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking device limit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
