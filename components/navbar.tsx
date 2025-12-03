'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Menu, X, User, LogOut, Home } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">DeviceLimiter</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <a href="/api/auth/logout"
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </a>
                  </>
                ) : (
                  <a href="/api/auth/login"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </a>
                )}
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/"
              className="text-gray-700 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard"
                      className="text-gray-700 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <a href="/api/auth/logout"
                      className="text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium">
                      Logout
                    </a>
                  </>
                ) : (
                  <a href="/api/auth/login"
                    className="text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
