import { useTheme } from '@/context/ThemeContext';

export function useColorScheme() {
  const { themeType, isDark } = useTheme();
  return isDark ? 'dark' : 'light';
}
