'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { User, Phone, Loader2 } from 'lucide-react';
import DeviceLimitModal from '@/components/device-limit-modal';

export default function OnboardingPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.profile && data.profile.full_name && data.profile.phone_number) {
          await checkDeviceLimit();
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user]);

  const checkDeviceLimit = async () => {
    try {
      const response = await fetch('/api/session/check');
      const data = await response.json();

      if (data.requiresAction) {
        setActiveSessions(data.activeSessions);
        setShowDeviceModal(true);
      } else {
        await fetch('/api/session/register', { method: 'POST' });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking device limit:', error);
      setError('Failed to verify device limit. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      await checkDeviceLimit();
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleForceLogout = async (sessionId: string) => {
    try {
      const response = await fetch('/api/session/force-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionIdToLogout: sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to force logout');
      }

      const data = await response.json();
      localStorage.setItem('sessionId', data.sessionId);

      setShowDeviceModal(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error forcing logout:', error);
      setError('Failed to logout device. Please try again.');
    }
  };

  if (userLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-gray-600 mt-2">We need a few more details to get you started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <button type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Saving...
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>

      <DeviceLimitModal
        isOpen={showDeviceModal}
        sessions={activeSessions}
        onClose={() => router.push('/api/auth/logout')}
        onForceLogout={handleForceLogout}
      />
    </div>
  );
}
