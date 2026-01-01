import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  style,
}: SearchBarProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search"
        size={20}
        color={theme.textTertiary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color={theme.textTertiary}
          onPress={onClear || (() => onChangeText(""))}
          style={styles.clearIcon}
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      borderRadius: BorderRadius.base,
      paddingHorizontal: Spacing.md,
      height: 48,
      ...Shadows.sm,
    },
    icon: {
      marginRight: Spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: Typography.fontSize.base,
      color: theme.text,
    },
    clearIcon: {
      marginLeft: Spacing.sm,
    },
  });
