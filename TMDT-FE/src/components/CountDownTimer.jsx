import { useState, useEffect } from "react";

export default function CountdownTimer({
  initialSeconds = 300,
  onExpire,
  resetTrigger,
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [resetTrigger, initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-lg shadow-sm select-none">
      {formatTime(seconds)}
    </span>
  );
}
