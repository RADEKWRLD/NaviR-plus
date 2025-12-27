'use client';

export default function GraphicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(var(--color-gray-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-light) 1px, transparent 1px)',
          backgroundSize: '90px 90px'
        }}
      />

      {/* Decorative geometric shapes */}
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#FF6B35] opacity-10" />
    </div>
  );
}
