import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ContactHeader } from "../components/crm/ContactHeader";
import { InfoSection } from "../components/crm/InfoSection";
import { QuickResponsesFooter } from "../components/crm/QuickResponsesFooter";
import { Timeline } from "../components/crm/Timeline";

export default function ContactDetailScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Header Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Details</Text>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ContactHeader name="Katherine Lim" />

        <InfoSection
          title="FOLLOW UP"
          content="3 days from now"
          meta="31 Oct 2019"
        />

        <InfoSection
          title="NOTES"
          content="Married with 2 kids, budget up to $2.5m. Looking at 3+ bedrooms, prefers high floors."
        />

        <Timeline />

        {/* Padding for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <QuickResponsesFooter />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
    },
    contentContainer: {
      paddingBottom: 20,
    },
    navBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingTop: (StatusBar.currentHeight || 0) + 10,
      paddingBottom: 10,
      backgroundColor: theme.primary,
      elevation: 4,
      shadowColor: "rgba(2, 8, 23, 0.2)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    navButton: {
      padding: 5,
      width: 40,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      flex: 1,
      textAlign: "center",
    },
    optionsLabel: {
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: "500",
    },
  });
