'use client';

interface Option {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SettingsSelect({
  options,
  value,
  onChange,
  disabled,
}: SettingsSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full px-4 py-3 border-[3px] border-(--border-default)
        bg-(--bg-main) text-(--text-primary) text-lg font-bold
        focus:outline-none focus:border-[#FF6B35]
        transition-colors cursor-pointer
        appearance-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{
        fontFamily: 'var(--font-oxanium)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '20px',
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
