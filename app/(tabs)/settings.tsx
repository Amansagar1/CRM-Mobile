import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Section */}
        <Card variant="elevated" style={styles.section}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/profile")}
          >
            <Avatar name="John Doe" size="xl" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@company.com</Text>
              <Text style={styles.profileRole}>Sales Manager</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </Card>

        {/* Preferences */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: theme.border,
                true: theme.primary,
              }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color={theme.text} />
              <Text style={styles.settingLabel}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{
                false: theme.border,
                true: theme.primary,
              }}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={theme.text} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="language-outline" size={24} color={theme.text} />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>English</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textTertiary}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Data & Privacy */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="cloud-download-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.settingLabel}>Export Data</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="sync-outline" size={24} color={theme.text} />
              <Text style={styles.settingLabel}>Sync Settings</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </Card>

        {/* Support */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.settingLabel}>Help Center</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.settingLabel}>Contact Support</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.settingLabel}>About</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>v1.0.0</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textTertiary}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={theme.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: Spacing.base,
      paddingBottom: Spacing.xxxl,
    },
    header: {
      marginBottom: Spacing.xl,
    },
    title: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
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
    profileContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileInfo: {
      flex: 1,
      marginLeft: Spacing.base,
    },
    profileName: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    profileEmail: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    profileRole: {
      fontSize: Typography.fontSize.sm,
      color: theme.textTertiary,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingLabel: {
      fontSize: Typography.fontSize.base,
      color: theme.text,
      marginLeft: Spacing.md,
    },
    settingRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingValue: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginRight: Spacing.sm,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: Spacing.base,
      borderRadius: BorderRadius.base,
      borderWidth: 1,
      borderColor: theme.error,
      marginTop: Spacing.xl,
    },
    logoutText: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.error,
      marginLeft: Spacing.sm,
    },
  });
