import { Colors, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  change?: number;
  changeLabel?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color,
  change,
  changeLabel,
}: StatCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const iconColor = color || theme.primary;
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}
        >
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>

      {change !== undefined && (
        <View style={styles.changeContainer}>
          <Ionicons
            name={isPositive ? "trending-up" : "trending-down"}
            size={14}
            color={isPositive ? Colors.success[500] : Colors.error[500]}
          />
          <Text
            style={[
              styles.change,
              { color: isPositive ? Colors.success[500] : Colors.error[500] },
            ]}
          >
            {Math.abs(change)}%
          </Text>
          {changeLabel && <Text style={styles.changeLabel}>{changeLabel}</Text>}
        </View>
      )}
    </Card>
  );
}

import { useMemo } from "react";

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      flex: 1,
      minWidth: 150,
    },
    header: {
      marginBottom: Spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    value: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    label: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
      fontWeight: Typography.fontWeight.medium,
    },
    changeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.sm,
    },
    change: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.semibold,
      marginLeft: Spacing.xs,
    },
    changeLabel: {
      fontSize: Typography.fontSize.xs,
      color: theme.textTertiary,
      marginLeft: Spacing.xs,
    },
  });
