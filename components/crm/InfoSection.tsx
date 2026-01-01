import { useTheme } from "@/context/ThemeContext";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface InfoSectionProps {
  title: string;
  content: string;
  meta?: string;
}

export const InfoSection = ({ title, content, meta }: InfoSectionProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {meta && <Text style={styles.meta}>{meta}</Text>}
      </View>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.textSecondary,
      letterSpacing: 1,
    },
    meta: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: "600",
    },
    content: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 22,
    },
  });
