'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FormInput from './FormInput';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(`Login failed, please try againe：${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-[3px] border-red-500 text-red-700 font-bold text-sm">
          {error}
        </div>
      )}

      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />

      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-[#FF6B35] hover:bg-[#E85A2B] text-white font-bold text-lg uppercase border-[3px] border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-oxanium)' }}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
