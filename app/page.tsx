'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Shield, Smartphone, Lock, Zap } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Secure Device Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Control which devices can access your account simultaneously with session management and real-time device monitoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoading ? (
              <div className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-400 bg-gray-100 rounded-lg">
                Loading...
              </div>
            ) : user ? (
              <Link href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                Go to Dashboard
              </Link>
            ) : (
              <a href="/api/auth/login"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                Get Started
              </a>
            )}
            <Link href="#features"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 lap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Securely</h3>
              <p className="text-gray-600">
                Sign in to your account using Auth0's secure authentication system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Limit Check</h3>
              <p className="text-gray-600">
                System verifies the number of active sessions against the configured limit (3 devices).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Access</h3>
              <p className="text-gray-600">
                If limit is reached, choose which device to log out to continue on the current device.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
        <h2 className="text-3xl font-bold text-center text-gray-900">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Security</h3>
            <p className="text-gray-600">
              Limit concurrent device access to prevent unauthorized account usage and enhance security.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Device Control</h3>
            <p className="text-gray-600">
              View and manage all devices with active sessions. Remove access from any device instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600">
              Get instant notifications when new devices log in or when you're logged out remotely.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Action</h3>
            <p className="text-gray-600">
              Force logout from other devices instantly when the device limit is reached.
            </p>
          </div>
        </div>
      </section>

      {!user && !isLoading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-linear-to-r from-blue-500 via-blue-700 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Account?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Start managing your devices with intelligent session control. Sign up now and experience
              enhanced security.
            </p>
            <a href="/api/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 hover:text-blue-800 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-2xl">
              Get Started Free
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
