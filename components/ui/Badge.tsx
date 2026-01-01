import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import type { ContactStatus, DealStage, TaskPriority } from "@/types/crm";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface BadgeProps {
  label: string;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | DealStage
    | TaskPriority
    | ContactStatus;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
}

export function Badge({
  label,
  variant = "default",
  size = "md",
  style,
}: BadgeProps) {
  const { theme, isDark } = useTheme();
  const backgroundColor = getBackgroundColor(variant, theme, isDark);
  const textColor = getTextColor(variant, theme, isDark);

  return (
    <View
      style={[
        styles.base,
        { backgroundColor },
        size === "sm" && styles.sm,
        size === "md" && styles.md,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          size === "sm" && styles.textSm,
          size === "md" && styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function getBackgroundColor(
  variant: string,
  theme: any,
  isDark: boolean
): string {
  const colorMap: Record<string, string> = {
    default: theme.backgroundTertiary,
    success: isDark ? Colors.success[900] : Colors.success[50],
    warning: isDark ? Colors.warning[900] : Colors.warning[50],
    error: isDark ? Colors.error[900] : Colors.error[50],
    info: isDark ? Colors.info[900] : Colors.info[50],
    // Deal stages
    lead: isDark ? Colors.secondary[800] : Colors.secondary[50],
    qualified: isDark ? Colors.info[900] : Colors.info[50],
    proposal: isDark ? Colors.warning[900] : Colors.warning[50],
    negotiation: isDark ? "#4338CA" : "#FFF9C4",
    won: isDark ? Colors.success[900] : Colors.success[50],
    lost: isDark ? Colors.error[900] : Colors.error[50],
    // Task priority
    high: isDark ? Colors.error[900] : Colors.error[50],
    medium: isDark ? Colors.warning[900] : Colors.warning[50],
    low: isDark ? Colors.success[900] : Colors.success[50],
    // Contact status
    active: isDark ? Colors.success[900] : Colors.success[50],
    inactive: isDark ? Colors.neutral[800] : Colors.neutral[100],
    customer: isDark ? Colors.primary[900] : Colors.primary[50],
    prospect: isDark ? Colors.info[900] : Colors.info[50],
  };
  return colorMap[variant] || colorMap.default;
}

function getTextColor(variant: string, theme: any, isDark: boolean): string {
  const colorMap: Record<string, string> = {
    default: theme.textSecondary,
    success: isDark ? Colors.success[200] : Colors.success[700],
    warning: isDark ? Colors.warning[200] : Colors.warning[700],
    error: isDark ? Colors.error[200] : Colors.error[700],
    info: isDark ? Colors.info[200] : Colors.info[700],
    // Deal stages
    lead: isDark ? Colors.secondary[200] : Colors.secondary[700],
    qualified: isDark ? Colors.info[200] : Colors.info[700],
    proposal: isDark ? Colors.warning[200] : Colors.warning[700],
    negotiation: isDark ? "#E0E7FF" : "#F57F17",
    won: isDark ? Colors.success[200] : Colors.success[700],
    lost: isDark ? Colors.error[200] : Colors.error[700],
    // Task priority
    high: isDark ? Colors.error[200] : Colors.error[700],
    medium: isDark ? Colors.warning[200] : Colors.warning[700],
    low: isDark ? Colors.success[200] : Colors.success[700],
    // Contact status
    active: isDark ? Colors.success[200] : Colors.success[700],
    inactive: isDark ? Colors.neutral[400] : Colors.neutral[600],
    customer: isDark ? Colors.primary[200] : Colors.primary[700],
    prospect: isDark ? Colors.info[200] : Colors.info[700],
  };
  return colorMap[variant] || colorMap.default;
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  sm: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontWeight: Typography.fontWeight.medium,
  },
  textSm: {
    fontSize: Typography.fontSize.xs,
  },
  textMd: {
    fontSize: Typography.fontSize.sm,
  },
});
