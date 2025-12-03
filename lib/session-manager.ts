import { getActiveSessions, createSession, deactivateSession } from './db';
import Ably from 'ably';

const MAX_DEVICES = parseInt(process.env.MAX_DEVICES || '3');

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  location?: string;
}

export async function checkDeviceLimit(userId: string): Promise<{
  canLogin: boolean;
  activeSessions: any[];
  requiresAction: boolean;
}> {
  const sessions = await getActiveSessions(userId);
  
  return {
    canLogin: sessions.length < MAX_DEVICES,
    activeSessions: sessions,
    requiresAction: sessions.length >= MAX_DEVICES,
  };
}

export async function forceLogoutSession(sessionId: string, userId: string): Promise<void> {
  await deactivateSession(sessionId);
  
  try {
    const ably = new Ably.Rest(process.env.ABLY_API_KEY || '');
    const channel = ably.channels.get(`session:${userId}`);
    await channel.publish('force-logout', { sessionId });
  } catch (error) {
    console.error('Error sending force logout notification:', error);
  }
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  let device = 'Desktop';
  if (ua.includes('mobile')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  
  return { browser, os, device };
}

export async function registerNewSession(
  userId: string,
  sessionId: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<void> {
  const deviceInfo = userAgent ? parseUserAgent(userAgent) : {};
  await createSession(userId, sessionId, deviceInfo, ipAddress, userAgent);
}
