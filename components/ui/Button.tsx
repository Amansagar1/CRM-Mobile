import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}` as keyof typeof styles] as TextStyle,
    styles[`text_${variant}` as keyof typeof styles] as TextStyle,
  ];

  const iconSize = size === "sm" ? 16 : size === "md" ? 18 : 20;
  const iconColor =
    variant === "outline" || variant === "ghost"
      ? theme.primary
      : theme.surface;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost"
              ? theme.primary
              : theme.surface
          }
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

import { useMemo } from "react";

const createStyles = (theme: any) =>
  StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: BorderRadius.base,
      paddingHorizontal: Spacing.lg,
    },
    sm: {
      height: 32,
      paddingHorizontal: Spacing.md,
    },
    md: {
      height: 40,
      paddingHorizontal: Spacing.lg,
    },
    lg: {
      height: 48,
      paddingHorizontal: Spacing.xl,
    },
    primary: {
      backgroundColor: theme.primary,
      ...Shadows.sm,
    },
    secondary: {
      backgroundColor: theme.backgroundSecondary,
      ...Shadows.sm,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.primary,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    danger: {
      backgroundColor: theme.error,
      ...Shadows.sm,
    },
    fullWidth: {
      width: "100%",
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontWeight: Typography.fontWeight.semibold,
    },
    text_sm: {
      fontSize: Typography.fontSize.sm,
    },
    text_md: {
      fontSize: Typography.fontSize.base,
    },
    text_lg: {
      fontSize: Typography.fontSize.md,
    },
    text_primary: {
      color: "#FFFFFF",
    },
    text_secondary: {
      color: theme.text,
    },
    text_outline: {
      color: theme.primary,
    },
    text_ghost: {
      color: theme.primary,
    },
    text_danger: {
      color: "#FFFFFF",
    },
    iconLeft: {
      marginRight: Spacing.xs,
    },
    iconRight: {
      marginLeft: Spacing.xs,
    },
  });
