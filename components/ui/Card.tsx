import { BorderRadius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "flat";
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = "elevated",
  padding = Spacing.base,
  style,
}: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          padding,
          backgroundColor:
            variant === "flat" ? theme.backgroundSecondary : theme.surface,
          borderColor: theme.border,
        },
        variant === "elevated" && styles.elevated,
        variant === "outlined" && styles.outlined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
  },
  elevated: {
    ...Shadows.base,
  },
  outlined: {
    borderWidth: 1,
  },
  flat: {},
});
