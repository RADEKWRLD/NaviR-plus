import SubtleGeometricBackground from '@/components/background/SubtleGeometricBackground';
import FloatingTagManager from '@/components/floating/FloatingTagManager';
import ClockDisplay from '@/components/clock/ClockDisplay';
import SearchInput from '@/components/search/SearchInput';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Subtle geometric background - fills entire screen */}
      <SubtleGeometricBackground />

      {/* Floating text tags layer */}
      <FloatingTagManager />

      {/* Main content layer - vertically centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Centered search area */}
        <div className="max-w-2xl w-full flex flex-col items-center gap-8">
          {/* Clock above search box */}
          <ClockDisplay />

          {/* Search input */}
          <SearchInput />
        </div>
      </div>
    </main>
  );
}
