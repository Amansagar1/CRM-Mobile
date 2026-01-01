import { Typography } from "@/constants/theme";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name, imageUrl, size = "md", style }: AvatarProps) {
  const initials = getInitials(name);
  const avatarSize = getSizeValue(size);
  const fontSize = getFontSize(size);
  const backgroundColor = getColorFromName(name);

  return (
    <View
      style={[
        styles.base,
        {
          width: avatarSize,
          height: avatarSize,
          backgroundColor,
          borderRadius: avatarSize / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getSizeValue(size: string): number {
  const sizeMap: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80,
  };
  return sizeMap[size] || 40;
}

function getFontSize(size: string): number {
  const fontMap: Record<string, number> = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
  };
  return fontMap[size] || 14;
}

function getColorFromName(name: string): string {
  const colors = [
    "#2196F3",
    "#9C27B0",
    "#4CAF50",
    "#FF9800",
    "#F44336",
    "#00BCD4",
    "#E91E63",
    "#3F51B5",
    "#009688",
    "#FF5722",
    "#795548",
    "#607D8B",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: Typography.fontWeight.semibold,
  },
});
