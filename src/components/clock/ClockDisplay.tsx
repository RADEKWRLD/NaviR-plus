'use client';

import { useState, useEffect } from 'react';

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

  return (
    <div className="text-right">
      {/* Label */}
      <div className="text-small tracking-widest mb-2">LOCAL TIME</div>

      {/* Time display - large bold numbers */}
      <div className="text-large font-bold tabular-nums">
        {hours}
        <span className="text-accent">:</span>
        {minutes}
      </div>
    </div>
  );
}
