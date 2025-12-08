'use client';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceCardProps {
  session: {
    id: number;
    session_id: string;
    device_info: {
      browser: string;
      os: string;
      device: string;
    };
    ip_address: string | null;
    last_activity: string;
  };
  isCurrent?: boolean;
  onLogout?: (sessionId: string) => void;
}

export default function DeviceCard({ session, isCurrent, onLogout }: DeviceCardProps) {
  const getDeviceIcon = () => {
    const deviceType = session.device_info?.device?.toLowerCase() || 'desktop';
    
    if (deviceType.includes('mobile')) {
      return <Smartphone className="w-8 h-8 text-blue-600" />;
    } else if (deviceType.includes('tablet')) {
      return <Tablet className="w-8 h-8 text-blue-600" />;
    }
    return <Monitor className="w-8 h-8 text-blue-600" />;
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-4 ${isCurrent ? 'border-green-500' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="mt-1">{getDeviceIcon()}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {session.device_info?.browser || 'Unknown Browser'}
              </h3>
              {isCurrent && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Current Device
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {session.device_info?.os || 'Unknown OS'} • {session.device_info?.device || 'Desktop'}
            </p>
            {session.ip_address && (
              <p className="text-xs text-gray-500 mt-1">IP: {session.ip_address}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Last active: {formatDistanceToNow(new Date(session.last_activity), { addSuffix: true })}
            </p>
          </div>
        </div>
        {!isCurrent && onLogout && (
          <button
            onClick={() => onLogout(session.session_id)}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors">
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
