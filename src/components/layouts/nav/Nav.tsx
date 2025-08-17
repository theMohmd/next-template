"use client";

import { useRef } from "react";

import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { Typography } from "@/components/common/Typography";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { cn } from "@/lib/utils/shadcn";

export default function Nav() {
  const scrollDirection = useScrollDirection();
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <nav
      ref={ref}
      className={cn(
        "bg-background sticky top-0 z-[1000] shrink-0 border-b transition-transform duration-400",
        scrollDirection === "down" &&
          ref.current?.clientHeight &&
          window.pageYOffset > ref.current.clientHeight
          ? "-translate-y-full"
          : "translate-y-0",
      )}
    >
      <div className="container mx-auto flex items-center gap-2 px-4 py-2">
        <Typography variant="h3">Nav</Typography>
        <ThemeSwitch className="ms-auto" />
      </div>
    </nav>
  );
}
