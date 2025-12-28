'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GraphicBackground from '@/components/background/GraphicBackground';
import AnimatedTypographyLayer from '@/components/typography/AnimatedTypographyLayer';
import BlobBackground from '@/components/background/BlobBackground';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <GraphicBackground />
      <AnimatedTypographyLayer />
      <BlobBackground />

      {/* Back Arrow Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-8 left-8 z-20 p-3 text-black hover:text-[#FF6B35] transition-colors"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-oxanium)' }}>
              NAVIR
            </h1>
            <p className="mt-2 text-sm text-gray-600 uppercase tracking-wider">
              Navigate Your World
            </p>
          </div>

          <div className=" border-black bg-white">
            <div className="flex border-b-[3px] border-black">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-4 px-6 text-lg font-bold uppercase transition-colors ${
                  mode === 'login'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'var(--font-oxanium)' }}
              >
                Login
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-4 px-6 text-lg font-bold uppercase transition-colors border-l-[3px] border-black ${
                  mode === 'register'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'var(--font-oxanium)' }}
              >
                Register
              </button>
            </div>

            <div className="p-8">
              {mode === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
