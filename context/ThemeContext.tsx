import { DarkTheme, LightTheme } from "@/constants/colors";
import React, { createContext, useContext, useState } from "react";
import { useColorScheme as _useColorScheme } from "react-native";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: typeof LightTheme;
  themeType: ThemeType;
  isDark: boolean;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = _useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>("system");

  const isDark =
    themeType === "system"
      ? systemColorScheme === "dark"
      : themeType === "dark";
  const theme = isDark ? DarkTheme : LightTheme;

  const toggleTheme = () => {
    setThemeType(isDark ? "light" : "dark");
  };

  const value = {
    theme,
    themeType,
    isDark,
    setThemeType,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
