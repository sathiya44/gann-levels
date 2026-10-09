"use client";

import { useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  function toggleTheme() {
    const systemIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const currentTheme =
      theme === "system" ? (systemIsDark ? "dark" : "light") : theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }

  const Icon =
    theme === "system" ? SunMoon : theme === "dark" ? Sun : Moon;
  const label =
    theme === "system"
      ? "Toggle color theme"
      : `Switch to ${theme === "dark" ? "light" : "dark"} mode`;

  return (
    <Button
      aria-label={label}
      className="text-muted-foreground"
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      <Icon aria-hidden="true" className="size-[18px]" />
    </Button>
  );
}
