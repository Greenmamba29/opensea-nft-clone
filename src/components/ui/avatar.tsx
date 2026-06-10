import * as React from "react";

import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
}

/** Initials avatar with a deterministic brand-tinted background. */
const TINTS = [
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
];

function Avatar({ name, className, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tint = TINTS[Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % TINTS.length];
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        tint,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
