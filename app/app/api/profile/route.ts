import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserProfile, upsertUserProfile } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const session = await getSession(request, res);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(session.user.sub);
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const session = await getSession(request, res);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, phoneNumber } = await request.json();

    if (!fullName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Full name and phone number are required' },
        { status: 400 }
      );
    }

    const profile = await upsertUserProfile(session.user.sub, fullName, phoneNumber);

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
