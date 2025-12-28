'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

export default function ClockDisplay() {
  const [time, setTime] = useState(new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    if (settings.appearance.clockFormat === '12h') {
      const hours = time.getHours() % 12 || 12;
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const period = time.getHours() >= 12 ? 'PM' : 'AM';
      return { hours: hours.toString().padStart(2, '0'), minutes, period };
    } else {
      return {
        hours: time.getHours().toString().padStart(2, '0'),
        minutes: time.getMinutes().toString().padStart(2, '0'),
        period: null,
      };
    }
  };

  const { hours, minutes, period } = formatTime();

  return (
    <div className="text-right">
      {/* Label */}
      <div className="text-small tracking-widest mb-2">LOCAL TIME</div>

      {/* Time display - large bold numbers */}
      <div className="text-large font-bold tabular-nums">
        {hours}
        <span className="text-accent">:</span>
        {minutes}
        {period && <span className="text-medium ml-2">{period}</span>}
      </div>
    </div>
  );
}
