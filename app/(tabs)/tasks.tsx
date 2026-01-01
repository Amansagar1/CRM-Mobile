import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { Colors, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { mockTasks } from "@/data/mockData";
import type { Task } from "@/types/crm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TasksScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "today" | "upcoming" | "completed"
  >("all");
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getFilteredTasks = () => {
    let filtered = mockTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (selectedFilter) {
      case "today":
        return filtered.filter((task) => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return (
            taskDate.getTime() === today.getTime() &&
            task.status !== "completed"
          );
        });
      case "upcoming":
        return filtered.filter(
          (task) => task.dueDate > today && task.status !== "completed"
        );
      case "completed":
        return filtered.filter((task) => task.status === "completed");
      default:
        return filtered;
    }
  };

  const filteredTasks = getFilteredTasks();

  const toggleTaskComplete = (taskId: string) => {
    // In real app, update task status
    console.log("Toggle task:", taskId);
  };

  const renderTaskCard = ({ item }: { item: Task }) => {
    const isCompleted = item.status === "completed";
    const isOverdue = !isCompleted && item.dueDate < new Date();

    return (
      <TouchableOpacity
        onPress={() => router.push(`/task-detail?id=${item.id}`)}
        activeOpacity={0.7}
      >
        <Card variant="elevated" style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleTaskComplete(item.id);
              }}
              style={styles.checkbox}
            >
              <Ionicons
                name={isCompleted ? "checkbox" : "square-outline"}
                size={24}
                color={isCompleted ? Colors.success[500] : theme.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.taskInfo}>
              <Text
                style={[
                  styles.taskTitle,
                  isCompleted && styles.taskTitleCompleted,
                ]}
              >
                {item.title}
              </Text>

              {item.description && (
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              <View style={styles.taskMeta}>
                {item.contactName && (
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="person-outline"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text style={styles.metaText}>{item.contactName}</Text>
                  </View>
                )}
                <View
                  style={[styles.metaItem, isOverdue && styles.overdueItem]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={isOverdue ? Colors.error[500] : theme.textSecondary}
                  />
                  <Text
                    style={[styles.metaText, isOverdue && styles.overdueText]}
                  >
                    {item.dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text style={styles.metaText}>{item.type}</Text>
                </View>
              </View>
            </View>

            <Badge label={item.priority} variant={item.priority} size="sm" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const pendingCount = mockTasks.filter((t) => t.status !== "completed").length;
  const completedCount = mockTasks.filter(
    (t) => t.status === "completed"
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tasks</Text>
            <Text style={styles.subtitle}>
              {pendingCount} pending • {completedCount} completed
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(["all", "today", "upcoming", "completed"] as const).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === filter && styles.filterTabTextActive,
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
          style={styles.searchBar}
        />

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <EmptyState
            icon="checkbox-outline"
            title="No tasks found"
            message={
              searchQuery
                ? "Try adjusting your search"
                : "Create your first task to get started"
            }
            actionLabel={!searchQuery ? "New Task" : undefined}
            onAction={!searchQuery ? () => router.push("/add-task") : undefined}
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/add-task")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
    },
    title: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
    },
    subtitle: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
      marginTop: Spacing.xs,
    },
    filterButton: {
      padding: Spacing.sm,
    },
    filterTabs: {
      flexDirection: "row",
      paddingHorizontal: Spacing.base,
      marginBottom: Spacing.md,
      gap: Spacing.sm,
    },
    filterTab: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: 20,
      backgroundColor: theme.backgroundSecondary,
    },
    filterTabActive: {
      backgroundColor: theme.primary,
    },
    filterTabText: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      color: theme.textSecondary,
    },
    filterTabTextActive: {
      color: "#FFFFFF",
    },
    searchBar: {
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.md,
    },
    listContent: {
      padding: Spacing.base,
      paddingBottom: 100,
    },
    taskCard: {
      marginBottom: Spacing.md,
    },
    taskHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    checkbox: {
      marginRight: Spacing.md,
      paddingTop: 2,
    },
    taskInfo: {
      flex: 1,
      marginRight: Spacing.md,
    },
    taskTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    taskTitleCompleted: {
      textDecorationLine: "line-through",
      color: theme.textTertiary,
    },
    taskDescription: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
      marginBottom: Spacing.sm,
    },
    taskMeta: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.md,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      fontSize: Typography.fontSize.xs,
      color: theme.textSecondary,
      marginLeft: Spacing.xs,
    },
    overdueItem: {
      backgroundColor: Colors.error[50],
      paddingHorizontal: Spacing.xs,
      paddingVertical: 2,
      borderRadius: 4,
    },
    overdueText: {
      color: Colors.error[700],
      fontWeight: Typography.fontWeight.medium,
    },
    fab: {
      position: "absolute",
      right: Spacing.xl,
      bottom: Spacing.xl,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      ...Shadows.lg,
    },
  });
