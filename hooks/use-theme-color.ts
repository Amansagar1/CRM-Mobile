/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from '@/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const { theme, isDark } = useTheme();
  const themeName = isDark ? 'dark' : 'light';
  const colorFromProps = props[themeName];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // @ts-ignore
    return theme[colorName];
  }
}
