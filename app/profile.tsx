import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { authService } from "@/services/api/auth.service";
import { User } from "@/types/auth.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log("Profile: Fetching user data...");
        const userData = await authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user for profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Profile: Logout button pressed.");
      await authService.logoutMutation();
      console.log("Profile: Logout mutation completed, navigating to login.");
      router.replace("/login");
    } catch (error) {
      console.error("Logout error in Profile UI:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.text }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Card with Gradient */}
        <LinearGradient
          colors={["#F46C24", "#EA580C", "#C2410C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <Avatar
              name={user ? `${user.firstname} ${user.lastname}` : "User"}
              imageUrl={require("../public/images/logo.png")}
              size="xxl"
              style={{ borderWidth: 4, borderColor: "#FFFFFF" }}
            />
          </View>

          <Text style={styles.profileName}>
            {user ? `${user.firstname} ${user.lastname}` : "Guest User"}
          </Text>
          <Text style={styles.profileEmail}>
            {user?.email || "No email available"}
          </Text>
          <Text style={styles.profileRole}>
            {user?.role ? user.role.toUpperCase().replace("_", " ") : "User"}
          </Text>
        </LinearGradient>

        {/* Details Card */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.detailRow}>
            <Ionicons
              name="call-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>
                {user?.phone || "Not provided"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="finger-print-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>User ID</Text>
              <Text style={[styles.detailValue, { fontSize: 12 }]}>
                {user?.id}
              </Text>
            </View>
          </View>
        </Card>

        {/* Org & Permissions Card */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Access & Scope</Text>

          <View style={styles.detailRow}>
            <Ionicons
              name="business-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Organizations</Text>
              <Text style={styles.detailValue}>
                {user?.org && user.org.length > 0
                  ? user.org.join(", ")
                  : "None"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.textSecondary}
            />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Permissions</Text>
              <View style={styles.permissionsGrid}>
                {user?.permissions &&
                  Object.entries(user.permissions).map(([key, value]) => (
                    <View key={key} style={styles.permissionBadge}>
                      <Ionicons
                        name={value ? "checkmark-circle" : "close-circle"}
                        size={14}
                        color={value ? Colors.success[500] : "#f44336"}
                      />
                      <Text style={styles.permissionText}>
                        {key.replace("_", " ")}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </Card>

        {/* App Settings */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="moon-outline" size={24} color={theme.text} />
              <Text style={styles.menuLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.border,
                true: theme.primary,
              }}
            />
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          icon="log-out-outline"
          fullWidth
          style={styles.logoutButton}
        />
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: Spacing.xs,
    },
    headerTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: Spacing.base,
      paddingBottom: Spacing.xxxl,
    },
    profileCard: {
      alignItems: "center",
      paddingVertical: Spacing.xl,
      marginBottom: Spacing.xl,
      borderRadius: BorderRadius.xl,
      elevation: 8,
      shadowColor: "#F46C24",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    profileHeader: {
      position: "relative",
      marginBottom: Spacing.base,
    },
    editAvatarButton: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: theme.surface,
    },
    profileName: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: "#FFFFFF",
      marginBottom: Spacing.xs,
    },
    profileEmail: {
      fontSize: Typography.fontSize.base,
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: 2,
    },
    profileRole: {
      fontSize: Typography.fontSize.sm,
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: Spacing.xl,
    },
    statsRow: {
      flexDirection: "row",
      width: "100%",
      paddingTop: Spacing.xl,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statDivider: {
      width: 1,
      backgroundColor: theme.border,
    },
    statValue: {
      fontSize: Typography.fontSize.xxl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginTop: Spacing.xs,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: Typography.fontSize.xs,
      color: theme.textSecondary,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.textSecondary,
      marginBottom: Spacing.md,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuLabel: {
      fontSize: Typography.fontSize.base,
      color: theme.text,
      marginLeft: Spacing.md,
    },
    menuRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuValue: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginRight: Spacing.sm,
    },
    logoutButton: {
      marginTop: Spacing.xl,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    detailTextContainer: {
      marginLeft: Spacing.md,
      flex: 1,
    },
    detailLabel: {
      fontSize: Typography.fontSize.xs,
      color: theme.textTertiary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    detailValue: {
      fontSize: Typography.fontSize.base,
      color: theme.text,
      marginTop: 2,
    },
    permissionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    permissionBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      gap: 4,
    },
    permissionText: {
      fontSize: Typography.fontSize.xs,
      color: theme.textSecondary,
      textTransform: "capitalize",
    },
  });
