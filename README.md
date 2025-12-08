# Law & Verdict Assignment

A Next.js application with Auth0 authentication that limits concurrent device logins to N devices (configured as 3).

## Features

- Auth0 authentication
- Device limit enforcement (max 3 concurrent devices)
- Real-time force logout notifications
- User profile management
- Active session monitoring
- Modern, responsive UI with Tailwind CSS

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Authentication**: Auth0
- **Database**: Vercel Postgres
- **Real-time**: Ably
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Key Components
1. **Session Management**: Tracks active user sessions in Postgres
2. **Device Limiting**: Enforces max 3 concurrent devices per account
3. **Real-time Notifications**: Uses Ably for instant logout notifications
4. **Profile System**: Collects and stores user details

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- Auth0 account
- Vercel account (for Postgres)
- Ably account

### 2. Auth0 Configuration

1. Create an Auth0 application (Regular Web Application)
2. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`, `https://your-domain.vercel.app/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`, `https://your-domain.vercel.app`
   - **Allowed Web Origins**: `http://localhost:3000`, `https://your-domain.vercel.app`

### 3. Vercel Postgres Setup

1. Create a new Postgres database in Vercel
2. Copy the connection strings

### 4. Ably Setup

1. Create an Ably account at https://ably.com
2. Create a new app
3. Copy the API key

### 5. Environment Variables

Create `.env.local`:
```env
AUTH0_SECRET=''
AUTH0_BASE_URL=''
AUTH0_ISSUER_BASE_URL=''
AUTH0_CLIENT_ID=''
AUTH0_CLIENT_SECRET=''
POSTGRES_URL=''
POSTGRES_PRISMA_URL=''
POSTGRES_URL_NON_POOLING=''
NEXT_PUBLIC_ABLY_KEY=''
ABLY_API_KEY=''
MAX_DEVICES=3
```

### 6. Install and Run
```bash
# Install dependencies
npm install

# Initialize database
# Visit http://localhost:3000/api/init-db after starting the server

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 7. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy again
vercel --prod
```

## How It Works

### Login Flow
1. User clicks "Login" → Redirected to Auth0
2. After authentication → Redirected to `/onboarding`
3. User completes profile (name + phone)
4. System checks active device count
5. If < 3 devices: Session registered, redirect to dashboard
6. If = 3 devices: Show device limit modal

### Force Logout Flow
1. User selects device to logout from modal
2. API deactivates session in database
3. Real-time notification sent via Ably
4. Target device receives notification
5. Target device shows countdown modal
6. Automatic logout after 10 seconds

### Session Monitoring
- Each login creates a unique session ID
- Sessions stored in Postgres with device info
- Background monitor listens for force-logout events
- Graceful logout with user notification

## API Routes

- `GET /api/auth/[auth0]` - Auth0 authentication handlers
- `GET /api/session/check` - Check active sessions
- `POST /api/session/register` - Register new session
- `POST /api/session/force-logout` - Force logout a session
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile
- `GET /api/init-db` - Initialize database tables

## Database Schema

### user_sessions
- `id`: Serial primary key
- `user_id`: User identifier from Auth0
- `session_id`: Unique session identifier
- `device_info`: JSON with browser, OS, device type
- `ip_address`: Client IP address
- `user_agent`: Browser user agent string
- `created_at`: Session creation timestamp
- `last_activity`: Last activity timestamp
- `is_active`: Boolean flag for active sessions

### user_profiles
- `user_id`: Primary key (Auth0 user ID)
- `full_name`: User's full name
- `phone_number`: User's phone number
- `created_at`: Profile creation timestamp
- `updated_at`: Last update timestamp

## Testing

### Test Scenario 1: Normal Login
1. Login with a new account
2. Complete onboarding
3. Verify dashboard displays profile

### Test Scenario 2: Device Limit
1. Login on 3 different browsers/devices
2. Try logging in on a 4th device
3. Verify device limit modal appears
4. Select a device to logout
5. Verify successful login on new device

### Test Scenario 3: Force Logout
1. Login on 2 devices
2. From device 1, logout device 2
3. On device 2, verify force logout notification
4. Verify automatic logout after countdown

## Troubleshooting

### Database Connection Issues
```bash
# Verify Postgres connection
vercel env pull

# Check connection strings are correct
```

### Auth0 Issues
- Verify callback URLs match exactly
- Check Auth0 application type is "Regular Web Application"
- Ensure client secret is correct

### Ably Real-time Issues
- Verify API key is correct
- Check Ably dashboard for connection logs
- Ensure firewall allows WebSocket connections