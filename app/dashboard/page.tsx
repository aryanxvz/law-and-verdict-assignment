'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Phone, Smartphone, Loader2 } from 'lucide-react';
import SessionMonitor from '@/components/session-monitor';
import DeviceCard from '@/components/device-card';

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        
        if (!profileData.profile || !profileData.profile.full_name) {
          router.push('/onboarding');
          return;
        }
        
        setProfile(profileData.profile);

        const sessionsRes = await fetch('/api/session/check');
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.activeSessions || []);

        const sessionId = localStorage.getItem('sessionId');
        setCurrentSessionId(sessionId);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const response = await fetch('/api/session/force-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionIdToLogout: sessionId }),
      });

      if (response.ok) {
        const sessionsRes = await fetch('/api/session/check');
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.activeSessions || []);
      }
    } catch (error) {
      console.error('Error logging out device:', error);
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <SessionMonitor />
      
      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-gray-600">Manage your profile and active devices</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-700">Full Name</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{profile?.full_name}</p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Phone className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-700">Phone Number</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{profile?.phone_number}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Active Devices</h2>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {sessions.length}/3 Devices
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active devices found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <DeviceCard
                  key={session.id}
                  session={session}
                  isCurrent={session.session_id === currentSessionId}
                  onLogout={session.session_id !== currentSessionId ? handleLogoutDevice : undefined}
                />
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You can have up to 3 active devices at a time. If you need to log in
              on a new device when the limit is reached, you'll be prompted to log out from one of your
              existing sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
