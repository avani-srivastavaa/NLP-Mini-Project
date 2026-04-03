import { Moon, SunMedium } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="h-11 rounded-full border-slate-300 bg-white/85 px-4 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:hover:bg-slate-900"
    >
      {isDark ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
      <span className="text-sm font-semibold">{isDark ? 'Light' : 'Dark'} Mode</span>
    </Button>
  );
}
