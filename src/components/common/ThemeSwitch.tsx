"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "./ui/button";

export function ThemeSwitch({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  const handleClick = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      className={className}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
