import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors, Spacing, Typography } from "@/constants/theme";
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

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar name="John Doe" size="xxl" />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@company.com</Text>
          <Text style={styles.profileRole}>Sales Manager</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color={theme.primary} />
              <Text style={styles.statValue}>247</Text>
              <Text style={styles.statLabel}>Contacts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name="briefcase"
                size={24}
                color={Colors.success[500]}
              />
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Active Deals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color={Colors.warning[500]} />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
        </Card>

        {/* Account Settings */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={24} color={theme.text} />
              <Text style={styles.menuLabel}>Edit Profile</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.menuLabel}>Change Password</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="mail-outline" size={24} color={theme.text} />
              <Text style={styles.menuLabel}>Email Preferences</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </Card>

        {/* App Settings */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.menuLabel}>Notifications</Text>
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

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="language-outline" size={24} color={theme.text} />
              <Text style={styles.menuLabel}>Language</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={[styles.menuValue, { color: theme.textSecondary }]}>
                English
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textTertiary}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Support */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.menuLabel}>Help Center</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.menuLabel}>Privacy Policy</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.menuLabel}>About</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={[styles.menuValue, { color: theme.textSecondary }]}>
                v1.0.0
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textTertiary}
              />
            </View>
          </TouchableOpacity>
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
      backgroundColor: theme.background,
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
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    profileEmail: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    profileRole: {
      fontSize: Typography.fontSize.sm,
      color: theme.textTertiary,
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
  });
