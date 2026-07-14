"use client";

import { useEffect, useMemo, useState } from "react";

type TaskCountdownProps = {
  finishesAt: string;
};

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TaskCountdown({ finishesAt }: TaskCountdownProps) {
  const target = useMemo(() => new Date(finishesAt).getTime(), [finishesAt]);
  const [remaining, setRemaining] = useState(() => target - Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemaining(target - Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [target]);

  if (remaining <= 0) {
    return <span className="font-black text-success">Gotowe do odbioru</span>;
  }

  return <span className="font-black text-accent">{formatRemaining(remaining)}</span>;
}
