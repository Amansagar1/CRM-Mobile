import { ContactHeader } from "@/components/crm/ContactHeader";
import { InfoSection } from "@/components/crm/InfoSection";
import { QuickResponsesFooter } from "@/components/crm/QuickResponsesFooter";
import { Timeline } from "@/components/crm/Timeline";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/context/ThemeContext";
import { contactService } from "@/services/api/contact.service";
import type { Contact } from "@/types/crm";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ContactDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await contactService.getContact(id);
        setContact(data);
      } catch (err: any) {
        setError(err.message || "Failed to load contact");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.safeArea, styles.center]}>
        <Text style={{ color: theme.text }}>Loading details...</Text>
      </View>
    );
  }

  if (error || !contact) {
    return (
      <View style={[styles.safeArea, styles.center]}>
        <Text style={{ color: theme.error }}>
          {error || "Contact not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: theme.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <View style={styles.statusContainer}>
          <Badge label={contact.status} variant={contact.status} size="sm" />
        </View>

        <ContactHeader
          name={`${contact.firstName} ${contact.lastName}`}
          phone={contact.phone}
          email={contact.email}
        />

        <InfoSection
          title="COMPANY"
          content={contact.company || "No Company"}
        />

        <InfoSection title="EMAIL" content={contact.email} />

        <InfoSection title="PHONE" content={contact.phone} />

        {contact.notes && <InfoSection title="NOTES" content={contact.notes} />}

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
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    statusContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: theme.background,
    },
    optionsLabel: {
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: "500",
    },
  });
