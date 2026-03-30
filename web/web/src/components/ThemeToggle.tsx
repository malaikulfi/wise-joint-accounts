import { IconButton } from '@transferwise/components';
import { Sun, Moon } from '@transferwise/icons';
import { useTheme } from '@wise/components-theming';

export function ThemeToggle() {
  const { isScreenModeDark, setScreenMode } = useTheme();

  const toggle = () => {
    setScreenMode(isScreenModeDark ? 'light' : 'dark');
  };

  return (
    <div className="theme-toggle">
      <IconButton size={40} priority="secondary" aria-label="Toggle theme" onClick={toggle}>
        {isScreenModeDark ? <Sun size={24} /> : <Moon size={24} />}
      </IconButton>
    </div>
  );
}
