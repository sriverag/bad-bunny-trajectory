"use client";

import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
}

export function CountdownTimer({
  timeLeft,
  totalTime,
  size = 56,
}: CountdownTimerProps) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - fraction);

  const isUrgent = timeLeft <= 5;

  const strokeColor =
    fraction > 0.6
      ? "stroke-green-500"
      : fraction > 0.3
        ? "stroke-yellow-500"
        : "stroke-red-500";

  const textColor =
    fraction > 0.6
      ? "text-green-500"
      : fraction > 0.3
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        isUrgent && "animate-pulse",
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={3}
          className="stroke-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-linear", strokeColor)}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      {/* Center number */}
      <span
        className={cn(
          "absolute text-sm font-bold tabular-nums",
          textColor,
        )}
      >
        {timeLeft}
      </span>
    </div>
  );
}
