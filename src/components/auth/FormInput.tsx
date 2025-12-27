interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

export default function FormInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: FormInputProps) {
  return (
    <div>
      <label
        className="block mb-2 text-sm font-bold uppercase tracking-wide"
        style={{ fontFamily: 'var(--font-oxanium)' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full px-4 py-3 border-[3px] border-black bg-white text-lg font-bold focus:outline-none focus:border-[#FF6B35] transition-colors"
        style={{ fontFamily: 'var(--font-oxanium)' }}
      />
    </div>
  );
}
