"use client";

import { CountUp } from "@/components/animations/count-up";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  className,
}: StatCounterProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="text-4xl font-heading text-primary md:text-5xl lg:text-6xl">
        <CountUp
          end={value}
          duration={2.5}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground md:text-base">
        {label}
      </p>
    </div>
  );
}
