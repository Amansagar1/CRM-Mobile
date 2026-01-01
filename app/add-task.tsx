import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import type { TaskPriority, TaskType } from "@/types/crm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddTaskScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [type, setType] = useState<TaskType>("call");

  const styles = useMemo(() => createStyles(theme), [theme]);

  const priorities: TaskPriority[] = ["low", "medium", "high"];
  const types: TaskType[] = ["call", "email", "meeting", "follow_up", "other"];

  const handleSave = () => {
    console.log("Saving task...");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>New Task</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Card variant="elevated">
          <Text style={styles.sectionTitle}>Task Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={theme.textTertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add task description..."
              placeholderTextColor={theme.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.optionSelector}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={styles.option}
                >
                  <Badge
                    label={p}
                    variant={p}
                    style={priority === p ? styles.selectedBadge : undefined}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.optionSelector}>
              {types.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={styles.option}
                >
                  <View
                    style={[
                      styles.typeOption,
                      type === t && styles.typeOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        type === t && styles.typeTextSelected,
                      ]}
                    >
                      {t.replace("_", " ")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Create Task"
            onPress={handleSave}
            variant="primary"
            style={styles.button}
          />
        </View>
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
    title: {
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
    sectionTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.textSecondary,
      marginBottom: Spacing.base,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    inputGroup: {
      marginBottom: Spacing.base,
    },
    label: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: BorderRadius.base,
      paddingHorizontal: Spacing.base,
      fontSize: Typography.fontSize.base,
      color: theme.text,
      backgroundColor: theme.surface,
    },
    textArea: {
      height: 100,
      paddingTop: Spacing.md,
    },
    optionSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
    },
    option: {
      marginBottom: Spacing.xs,
    },
    selectedBadge: {
      borderWidth: 2,
      borderColor: theme.primary,
    },
    typeOption: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundSecondary,
    },
    typeOptionSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    typeText: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      color: theme.textSecondary,
      textTransform: "capitalize",
    },
    typeTextSelected: {
      color: "#FFFFFF",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: Spacing.md,
      marginTop: Spacing.xl,
    },
    button: {
      flex: 1,
    },
  });
