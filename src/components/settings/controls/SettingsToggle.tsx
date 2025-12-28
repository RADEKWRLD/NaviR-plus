'use client';

interface SettingsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function SettingsToggle({
  checked,
  onChange,
  disabled,
}: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative w-14 h-8 rounded-full border-[3px] border-(--border-default)
        transition-colors duration-200
        ${checked ? 'bg-(--color-accent)' : 'bg-(--color-gray-light)'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-(--bg-main) rounded-full
          border-2 border-(--border-default)
          transition-transform duration-200
          ${checked ? 'translate-x-6' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
}
