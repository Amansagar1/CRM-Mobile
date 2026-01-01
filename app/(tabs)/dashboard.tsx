import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { mockContacts, mockMetrics } from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const recentContacts = mockContacts.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />

      {/* Header - Outside ScrollView */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Here's your business overview</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-circle" size={40} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {mockMetrics.map((metric) => (
            <StatCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              icon={metric.icon as any}
              color={metric.color}
              change={metric.change}
              changeLabel={metric.changeLabel}
            />
          ))}
        </View>

        {/* Recent Contacts */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Contacts</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/index")}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactItem}
              onPress={() => router.push(`/contact-detail?id=${contact.id}`)}
            >
              <Avatar
                name={`${contact.firstName} ${contact.lastName}`}
                size="md"
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>
                  {contact.firstName} {contact.lastName}
                </Text>
                <Text style={styles.contactCompany}>{contact.company}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/add-contact")}
          >
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor: isDark
                    ? theme.backgroundTertiary
                    : "#FFE8D6",
                },
              ]}
            >
              <Ionicons name="person-add" size={24} color={theme.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add New Contact</Text>
              <Text style={styles.actionDescription}>
                Create a new contact entry
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor: isDark
                    ? theme.backgroundTertiary
                    : "#E8F5E9",
                },
              ]}
            >
              <Ionicons name="document-text" size={24} color={theme.success} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>
                Download contacts as CSV
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/profile")}
          >
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor: isDark
                    ? theme.backgroundTertiary
                    : "#F3E5F5",
                },
              ]}
            >
              <Ionicons name="settings" size={24} color="#9C27B0" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionDescription}>
                Manage your preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </Card>
      </ScrollView>
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
    },
    contentContainer: {
      padding: Spacing.base,
      paddingBottom: Spacing.xxxl,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing.base,
      paddingTop: (StatusBar.currentHeight || 0) + Spacing.md,
      paddingBottom: Spacing.md,
      elevation: 4,
      shadowColor: "rgba(2, 8, 23, 0.2)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    greeting: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: "#FFFFFF", // White text on orange
    },
    subtitle: {
      fontSize: Typography.fontSize.base,
      color: "#FFFFFF",
      marginTop: Spacing.xs,
      opacity: 0.9,
    },
    profileButton: {
      padding: Spacing.xs,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
    },
    seeAll: {
      fontSize: Typography.fontSize.sm,
      color: theme.primary,
      fontWeight: Typography.fontWeight.semibold,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    contactInfo: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    contactName: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.text,
      marginBottom: 2,
    },
    contactCompany: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginRight: Spacing.md,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.text,
      marginBottom: 2,
    },
    actionDescription: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
    },
  });
