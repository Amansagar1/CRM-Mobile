import { useTheme } from "@/context/ThemeContext";

import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const QuickResponsesFooter = () => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
     
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 30,
      left: 20,
      right: 20,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 4,
    },
    gradient: {
      flexDirection: "row",
      height: 54,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    icon: {
      marginRight: 10,
    },
    text: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      letterSpacing: 1,
    },
  });
