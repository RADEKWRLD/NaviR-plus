'use client';

import { useState, useEffect } from 'react';
import AnimatedDigit from './AnimatedDigit';

export default function ClockDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const hourDigits = hours.split('').map(Number);
  const minuteDigits = minutes.split('').map(Number);

  return (
    <div className="flex items-center gap-1 text-4xl font-semibold text-gray-500 tabular-nums">
      <AnimatedDigit value={hourDigits[0]} />
      <AnimatedDigit value={hourDigits[1]} />
      <span className="opacity-50">:</span>
      <AnimatedDigit value={minuteDigits[0]} />
      <AnimatedDigit value={minuteDigits[1]} />
    </div>
  );
}
