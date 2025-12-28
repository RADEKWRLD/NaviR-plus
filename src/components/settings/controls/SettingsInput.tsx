'use client';

interface SettingsInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SettingsInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
}: SettingsInputProps) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-bold uppercase tracking-wide text-(--text-primary)"
        style={{ fontFamily: 'var(--font-oxanium)' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border-[3px] border-(--border-default)
          bg-(--bg-main) text-(--text-primary) text-lg font-bold
          focus:outline-none focus:border-[#FF6B35]
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ fontFamily: 'var(--font-oxanium)' }}
      />
    </div>
  );
}
