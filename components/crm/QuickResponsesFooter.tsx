import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const QuickResponsesFooter = () => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <LinearGradient
        colors={["#4facfe", "#af40ff"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <Ionicons name="send" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.text}>QUICK RESPONSES</Text>
      </LinearGradient>
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
