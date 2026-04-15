"use client";

import { MoonStar, SunMedium, Trees } from "lucide-react";
import { useTheme } from "next-themes";


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { key: "light", label: "Light", icon: SunMedium },
    { key: "dark", label: "Dark", icon: MoonStar },
    { key: "system", label: "System", icon: Trees },
  ] as const;

  return (
    <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--panel)] p-1 shadow-[var(--shadow-soft)]">
      {options.map((option) => {
        const Icon = option.icon;
        const active = (theme ?? "system") === option.key;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setTheme(option.key)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
              active
                ? "bg-[var(--card)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

