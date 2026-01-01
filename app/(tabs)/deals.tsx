import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { Colors, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { mockDeals } from "@/data/mockData";
import type { Deal } from "@/types/crm";
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

export default function DealsScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredDeals = mockDeals.filter((deal) =>
    `${deal.title} ${deal.contactName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const renderDealCard = ({ item }: { item: Deal }) => (
    <TouchableOpacity
      onPress={() => router.push(`/deal-detail?id=${item.id}`)}
      activeOpacity={0.7}
    >
      <Card variant="elevated" style={styles.dealCard}>
        <View style={styles.dealHeader}>
          <View style={styles.dealInfo}>
            <Text style={styles.dealTitle}>{item.title}</Text>
            <Text style={styles.dealContact}>
              <Ionicons
                name="person-outline"
                size={14}
                color={theme.textSecondary}
              />{" "}
              {item.contactName}
            </Text>
          </View>
          <Badge label={item.stage} variant={item.stage} />
        </View>

        <View style={styles.dealMeta}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="cash-outline"
                size={18}
                color={Colors.success[500]}
              />
              <Text style={styles.dealValue}>
                ${(item.value / 1000).toFixed(0)}K
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={theme.textSecondary}
              />
              <Text style={styles.metaText}>
                {item.expectedCloseDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Probability Bar */}
        <View style={styles.probabilityContainer}>
          <View style={styles.probabilityHeader}>
            <Text style={styles.probabilityLabel}>Probability</Text>
            <Text style={styles.probabilityValue}>{item.probability}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.probability}%`,
                  backgroundColor: getProbabilityColor(item.probability),
                },
              ]}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  // Group deals by stage
  const dealsByStage = filteredDeals.reduce((acc, deal) => {
    if (!acc[deal.stage]) acc[deal.stage] = [];
    acc[deal.stage].push(deal);
    return acc;
  }, {} as Record<string, Deal[]>);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = filteredDeals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Deals</Text>
            <Text style={styles.subtitle}>
              {activeDeals} active • ${(totalValue / 1000).toFixed(0)}K total
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search deals..."
          style={styles.searchBar}
        />

        {/* Deals List */}
        {filteredDeals.length > 0 ? (
          <FlatList
            data={filteredDeals}
            renderItem={renderDealCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <EmptyState
            icon="briefcase-outline"
            title="No deals found"
            message={
              searchQuery
                ? "Try adjusting your search"
                : "Create your first deal to get started"
            }
            actionLabel={!searchQuery ? "Create Deal" : undefined}
            onAction={!searchQuery ? () => router.push("/add-deal") : undefined}
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/add-deal")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function getProbabilityColor(probability: number): string {
  if (probability >= 75) return Colors.success[500];
  if (probability >= 50) return Colors.warning[500];
  return Colors.error[500];
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
    searchBar: {
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.md,
    },
    listContent: {
      padding: Spacing.base,
      paddingBottom: 100,
    },
    dealCard: {
      marginBottom: Spacing.md,
    },
    dealHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: Spacing.md,
    },
    dealInfo: {
      flex: 1,
      marginRight: Spacing.md,
    },
    dealTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    dealContact: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
    },
    dealMeta: {
      marginBottom: Spacing.md,
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    dealValue: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: Colors.success[500],
      marginLeft: Spacing.xs,
    },
    metaText: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginLeft: Spacing.xs,
    },
    probabilityContainer: {
      marginTop: Spacing.sm,
    },
    probabilityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: Spacing.xs,
    },
    probabilityLabel: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
    },
    probabilityValue: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.text,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
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
