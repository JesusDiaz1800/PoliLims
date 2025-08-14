
"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardThemeToggleProps {
    theme: string;
    setTheme: (theme: 'light' | 'dark') => void;
}

export function DashboardThemeToggle({ theme, setTheme }: DashboardThemeToggleProps) {
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:bg-white/10 hover:text-white">
            <Sun className={`h-6 w-6 rotate-0 scale-100 transition-all ${theme === 'dark' ? 'dark:-rotate-90 dark:scale-0' : ''}`} />
            <Moon className={`absolute h-6 w-6 rotate-90 scale-0 transition-all ${theme === 'dark' ? 'dark:rotate-0 dark:scale-100' : ''}`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
