import { Button } from "@/components/ui/Button";
import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { authService } from "@/services/api";
import { ApiError } from "@/types/auth.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleLogin = async () => {
    // Clear previous errors
    setError("");

    // Validate inputs
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email: email.trim() });

      const response = await authService.loginMutation({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login response:", response);

      // Check if we got a valid user response (has id field)
      if (response && response.id) {
        // Navigate to dashboard on successful login
        router.replace("/(tabs)/dashboard");
      } else {
        console.log("Login failed - no user ID in response");
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const apiError = err as ApiError;
      const errorMessage =
        apiError.message || "An error occurred during login. Please try again.";
      setError(errorMessage);

      // Show alert for critical errors
      if (apiError.status && apiError.status >= 500) {
        Alert.alert(
          "Server Error",
          "Unable to connect to the server. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="business" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>CRM Pro</Text>
            <Text style={styles.tagline}>
              Manage your business relationships
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={theme.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <Ionicons
                  name={rememberMe ? "checkbox" : "square-outline"}
                  size={20}
                  color={rememberMe ? theme.primary : theme.textTertiary}
                />
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <Button
              title={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              fullWidth
              style={styles.loginButton}
              disabled={isLoading}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Dont have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    content: {
      flex: 1,
      paddingHorizontal: Spacing.xl,
      justifyContent: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: Spacing.xxxl,
    },
    logoCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.base,
      ...Shadows.lg,
    },
    appName: {
      fontSize: Typography.fontSize.huge,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    tagline: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
    },
    formContainer: {
      width: "100%",
    },
    welcomeText: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginBottom: Spacing.xl,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      borderRadius: BorderRadius.base,
      paddingHorizontal: Spacing.base,
      marginBottom: Spacing.base,
      height: 56,
      ...Shadows.sm,
    },
    inputIcon: {
      marginRight: Spacing.md,
    },
    input: {
      flex: 1,
      fontSize: Typography.fontSize.base,
      color: theme.text,
    },
    eyeIcon: {
      padding: Spacing.xs,
    },
    optionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.xl,
    },
    rememberMe: {
      flexDirection: "row",
      alignItems: "center",
    },
    rememberMeText: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
      marginLeft: Spacing.xs,
    },
    forgotPassword: {
      fontSize: Typography.fontSize.sm,
      color: theme.primary,
      fontWeight: Typography.fontWeight.semibold,
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FEE2E2",
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
      marginBottom: Spacing.base,
      gap: Spacing.xs,
    },
    errorText: {
      flex: 1,
      fontSize: Typography.fontSize.sm,
      color: "#DC2626",
      fontWeight: Typography.fontWeight.medium,
    },
    loginButton: {
      marginBottom: Spacing.xl,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      fontSize: Typography.fontSize.sm,
      color: theme.textTertiary,
      marginHorizontal: Spacing.base,
    },
    socialButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: Spacing.base,
      marginBottom: Spacing.xl,
    },
    socialButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      ...Shadows.sm,
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    signupText: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
    },
    signupLink: {
      fontSize: Typography.fontSize.sm,
      color: theme.primary,
      fontWeight: Typography.fontWeight.semibold,
    },
  });
