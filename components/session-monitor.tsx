'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Ably from 'ably';
import { AlertTriangle } from 'lucide-react';

export default function SessionMonitor() {
  const { user } = useUser();
  const router = useRouter();
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!user) return;
    const ably = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY || '');
    const channel = ably.channels.get(`session:${user.sub}`);

    channel.subscribe('force-logout', (message) => {
      const currentSessionId = localStorage.getItem('sessionId');
      if (message.data.sessionId === currentSessionId) {
        setShowLogoutWarning(true);
        
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              window.location.href = '/api/auth/logout';
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    });

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [user]);

  if (!showLogoutWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Session Ended</h2>
        </div>
        <p className="text-gray-700 mb-4">
          You have been logged out because this account was logged in on another device. The maximum
          number of concurrent devices has been reached.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-900 text-center">
            Redirecting to login in <span className="font-bold text-xl">{countdown}</span> seconds...
          </p>
        </div>

        <button onClick={() => window.location.href = '/api/auth/logout'}
          className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-medium">
          Logout Now
        </button>
      </div>
    </div>
  );
}