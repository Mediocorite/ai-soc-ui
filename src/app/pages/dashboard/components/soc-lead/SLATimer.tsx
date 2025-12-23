
import React, { useState, useEffect } from 'react';

interface SLATimerProps {
  deadline: string;
}

const SLATimer: React.FC<SLATimerProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      setTimeLeft(diff);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isBreached = timeLeft < 0;
  const absTime = Math.abs(timeLeft);
  const hours = Math.floor(absTime / (1000 * 60 * 60));
  const minutes = Math.floor((absTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absTime % (1000 * 60)) / 1000);

  const displayTime = `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;

  if (isBreached) {
    return (
      <div className="flex items-center space-x-1.5 text-red-600 font-semibold animate-pulse">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>BREACHED: {displayTime}</span>
      </div>
    );
  }

  const isRisk = timeLeft < 20 * 60000; // Less than 20 mins
  return (
    <div className={`flex items-center space-x-1.5 font-medium ${isRisk ? 'text-amber-600' : 'text-emerald-600'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{displayTime}</span>
    </div>
  );
};

export default SLATimer;
