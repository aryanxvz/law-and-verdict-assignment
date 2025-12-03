import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/onboarding',
  }),
  callback: handleCallback({
    afterCallback: async (req: NextRequest, session: any) => {
      const sessionId = uuidv4();
      
      return {
        ...session,
        user: {
          ...session.user,
          sessionId,
        },
      };
    },
  }),
  logout: handleLogout({
    returnTo: '/',
  }),
});