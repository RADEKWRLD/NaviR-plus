'use client';

import { ReactNode } from 'react';

interface SettingsButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export default function SettingsButton({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
}: SettingsButtonProps) {
  const baseClasses = `
    px-6 py-3 border-[3px] font-bold uppercase tracking-wide
    transition-colors duration-200
  `;

  const variantClasses = {
    primary: `
      border-[var(--border-default)] bg-[var(--bg-main)] text-[var(--text-primary)]
      hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35]
    `,
    danger: `
      border-red-500 bg-red-500 text-white
      hover:bg-red-600 hover:border-red-600
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{ fontFamily: 'var(--font-oxanium)' }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
