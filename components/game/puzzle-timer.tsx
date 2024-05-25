"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export default function PuzzleTimer({
  initialSeconds,
  secondsLeft,
  setSecondsLeft,
  isActive,
  setIsActive,
}: {
  initialSeconds: number;
  secondsLeft: number;
  setSecondsLeft: (secondsLeft: number) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    setProgress((secondsLeft / initialSeconds) * 100);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);
  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={`text-4xl font-semibold mb-2 ${
            secondsLeft <= 5 && secondsLeft > 0
              ? "text-red-500 animate-ping"
              : secondsLeft === 0
              ? "text-red-500"
              : ""
          }`}
        >
          {secondsLeft}
        </div>
        <Progress value={progress} className="h-2 ml-1" />
      </div>
    </>
  );
}
