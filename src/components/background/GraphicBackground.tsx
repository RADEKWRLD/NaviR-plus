'use client';

export default function GraphicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(var(--color-gray-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-light) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Decorative geometric shapes */}
      <div className="absolute top-10 right-10 w-24 h-24 border-[3px] border-black rotate-45" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#FF6B35] opacity-10" />
    </div>
  );
}
