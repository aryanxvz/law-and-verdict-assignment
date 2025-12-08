'use client';
import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import DeviceCard from './device-card';

interface DeviceLimitModalProps {
  isOpen: boolean;
  sessions: any[];
  onClose: () => void;
  onForceLogout: (sessionId: string) => Promise<void>;
}

export default function DeviceLimitModal({
  isOpen,
  sessions,
  onClose,
  onForceLogout,
}: DeviceLimitModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleForceLogout = async (sessionId: string) => {
    setIsLoggingOut(true);
    try {
      await onForceLogout(sessionId);
    } catch (error) {
      console.error('Error during force logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Device Limit Reached</h2>
          </div>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoggingOut}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              You've reached the maximum number of devices (3) for this account. To continue logging in
              on this device, please log out from one of your existing sessions below.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
          
          <div className="space-y-3">
            {sessions.map((session) => (
              <DeviceCard
                key={session.id}
                session={session}
                onLogout={handleForceLogout}
              />
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoggingOut}>
            Cancel Login
          </button>
        </div>
      </div>
    </div>
  );
}
