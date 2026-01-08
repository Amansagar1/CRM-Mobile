import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { authService } from "@/services/api/auth.service";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { theme, isDark } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authService.getToken();
      const inAuthGroup = segments[0] === "login";

      if (!token && !inAuthGroup) {
        // Redirect to login if not authenticated and not already on the login page
        router.replace("/login");
      } else if (token && inAuthGroup) {
        // Redirect to dashboard if authenticated and trying to access login page
        router.replace("/(tabs)/dashboard");
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <NavigationThemeProvider
      value={isDark ? NavigationDarkTheme : NavigationDefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
