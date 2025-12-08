import { sql } from '@vercel/postgres';

export interface UserSession {
  id: number;
  user_id: string;
  session_id: string;
  device_info: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
  last_activity: Date;
  is_active: boolean;
}

export interface UserProfile {
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        device_info JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active)`;

    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255),
        phone_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getActiveSessions(userId: string): Promise<UserSession[]> {
  const result = await sql<UserSession>`
    SELECT * FROM user_sessions 
    WHERE user_id = ${userId} AND is_active = true 
    ORDER BY last_activity DESC
  `;
  return result.rows;
}

export async function createSession(
  userId: string,
  sessionId: string,
  deviceInfo: any,
  ipAddress: string | null,
  userAgent: string | null
): Promise<UserSession> {
  const result = await sql<UserSession>`
    INSERT INTO user_sessions (user_id, session_id, device_info, ip_address, user_agent)
    VALUES (${userId}, ${sessionId}, ${JSON.stringify(deviceInfo)}, ${ipAddress}, ${userAgent})
    RETURNING *
  `;
  return result.rows[0];
}

export async function deactivateSession(sessionId: string): Promise<void> {
  await sql`
    UPDATE user_sessions 
    SET is_active = false 
    WHERE session_id = ${sessionId}
  `;
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  await sql`
    UPDATE user_sessions 
    SET last_activity = CURRENT_TIMESTAMP 
    WHERE session_id = ${sessionId} AND is_active = true
  `;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const result = await sql<UserProfile>`
    SELECT * FROM user_profiles WHERE user_id = ${userId}
  `;
  return result.rows[0] || null;
}

export async function upsertUserProfile(
  userId: string,
  fullName: string,
  phoneNumber: string
): Promise<UserProfile> {
  const result = await sql<UserProfile>`
    INSERT INTO user_profiles (user_id, full_name, phone_number, updated_at)
    VALUES (${userId}, ${fullName}, ${phoneNumber}, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      full_name = ${fullName},
      phone_number = ${phoneNumber},
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result.rows[0];
}

export async function getSessionById(sessionId: string): Promise<UserSession | null> {
  const result = await sql<UserSession>`
    SELECT * FROM user_sessions WHERE session_id = ${sessionId}
  `;
  return result.rows[0] || null;
}
