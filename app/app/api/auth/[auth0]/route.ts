import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/onboarding',
  }),
  callback: handleCallback({
    afterCallback: async (req: any, session: any) => {
      return session;
    },
  }),
  logout: handleLogout({
    returnTo: '/',
  }),
});
