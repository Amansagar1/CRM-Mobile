import { Card } from "@/components/ui/Card";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { mockDeals } from "@/data/mockData";
import type { DealStage } from "@/types/crm";
import React, { useMemo } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // Calculate metrics
  const totalDeals = mockDeals.length;
  const wonDeals = mockDeals.filter((d) => d.stage === "won").length;
  const lostDeals = mockDeals.filter((d) => d.stage === "lost").length;
  const activeDeals = totalDeals - wonDeals - lostDeals;

  const totalRevenue = mockDeals
    .filter((d) => d.stage === "won")
    .reduce((sum, d) => sum + d.value, 0);

  const pipelineValue = mockDeals
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);

  const conversionRate =
    totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(1) : "0";

  // Deals by stage
  const dealsByStage = mockDeals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<DealStage, number>);

  const stages: DealStage[] = [
    "lead",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
  ];
  const maxCount = Math.max(...stages.map((s) => dealsByStage[s] || 0));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Performance overview</Text>
        </View>

        {/* Key Metrics */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                ${(totalRevenue / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                ${(pipelineValue / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.metricLabel}>Pipeline Value</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{activeDeals}</Text>
              <Text style={styles.metricLabel}>Active Deals</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{conversionRate}%</Text>
              <Text style={styles.metricLabel}>Win Rate</Text>
            </View>
          </View>
        </Card>

        {/* Deals Funnel */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Deals Funnel</Text>

          <View style={styles.funnelContainer}>
            {stages.map((stage) => {
              const count = dealsByStage[stage] || 0;
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

              return (
                <View key={stage} style={styles.funnelStage}>
                  <View style={styles.funnelInfo}>
                    <Text style={styles.funnelLabel}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </Text>
                    <Text style={styles.funnelCount}>{count}</Text>
                  </View>
                  <View style={styles.funnelBarContainer}>
                    <View
                      style={[
                        styles.funnelBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getStageColor(stage),
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Revenue Breakdown */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: Colors.success[500] },
                ]}
              />
              <Text style={styles.breakdownLabel}>Won Deals</Text>
            </View>
            <Text style={styles.breakdownValue}>
              ${(totalRevenue / 1000).toFixed(0)}K ({wonDeals})
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: Colors.warning[500] },
                ]}
              />
              <Text style={styles.breakdownLabel}>In Pipeline</Text>
            </View>
            <Text style={styles.breakdownValue}>
              ${(pipelineValue / 1000).toFixed(0)}K ({activeDeals})
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <View
                style={[
                  styles.breakdownDot,
                  { backgroundColor: Colors.error[500] },
                ]}
              />
              <Text style={styles.breakdownLabel}>Lost Deals</Text>
            </View>
            <Text style={styles.breakdownValue}>{lostDeals} deals</Text>
          </View>
        </Card>

        {/* Performance Summary */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Average Deal Size</Text>
            <Text style={styles.summaryValue}>
              ${wonDeals > 0 ? (totalRevenue / wonDeals / 1000).toFixed(0) : 0}K
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Deals</Text>
            <Text style={styles.summaryValue}>{totalDeals}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Success Rate</Text>
            <Text style={styles.summaryValue}>{conversionRate}%</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStageColor(stage: DealStage): string {
  const colorMap: Record<DealStage, string> = {
    lead: Colors.secondary[500],
    qualified: Colors.info[500],
    proposal: Colors.warning[500],
    negotiation: "#FBC02D",
    won: Colors.success[500],
    lost: Colors.error[500],
  };
  return colorMap[stage];
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
    subtitle: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginTop: Spacing.xs,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.base,
    },
    metricsGrid: {
      flexDirection: "row",
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    metricCard: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
      padding: Spacing.base,
      borderRadius: 12,
    },
    metricValue: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    metricLabel: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
    },
    funnelContainer: {
      gap: Spacing.md,
    },
    funnelStage: {
      gap: Spacing.xs,
    },
    funnelInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    funnelLabel: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.medium,
      color: theme.text,
    },
    funnelCount: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.textSecondary,
    },
    funnelBarContainer: {
      height: 32,
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 8,
      overflow: "hidden",
    },
    funnelBar: {
      height: "100%",
      borderRadius: 8,
    },
    breakdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    breakdownLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    breakdownDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: Spacing.sm,
    },
    breakdownLabel: {
      fontSize: Typography.fontSize.base,
      color: theme.text,
    },
    breakdownValue: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.text,
    },
    summaryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    summaryLabel: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
    },
    summaryValue: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
    },
  });
