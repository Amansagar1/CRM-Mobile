import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { contactService } from "@/services/api/contact.service";
import type { Contact } from "@/types/crm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ContactsScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const fetchContacts = useCallback(
    async (targetPage = 1, isRefreshing = false) => {
      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else if (targetPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response = await contactService.getContacts(
          targetPage,
          PAGE_SIZE
        );

        // Map API response to Contact type
        let contactsArray: any[] = [];

        if (Array.isArray(response.data?.data)) {
          contactsArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          contactsArray = response.data;
        } else if (Array.isArray(response)) {
          contactsArray = response;
        }

        // Determine if there are more items
        if (contactsArray.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        const mappedContacts: Contact[] = contactsArray.map((item: any) =>
          contactService.mapToContact(item)
        );

        if (targetPage === 1) {
          setContacts(mappedContacts);
          setPage(1);
        } else {
          setContacts((prev) => [...prev, ...mappedContacts]);
          setPage(targetPage);
        }
      } catch (err: any) {
        setError(`DEBUG ERROR: ${err.message || String(err)}`);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchContacts(1);
  }, [fetchContacts]);

  const onRefresh = React.useCallback(() => {
    setHasMore(true);
    fetchContacts(1, true);
  }, [fetchContacts]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore && !searchQuery) {
      fetchContacts(page + 1);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

  // Helper functions to open native apps
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleSMS = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`).catch(() => {
      Alert.alert(
        "WhatsApp not installed",
        "Please install WhatsApp to use this feature"
      );
    });
  };

  const renderContactCard = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      onPress={() => router.push(`/contact-detail?id=${item.id}`)}
      activeOpacity={0.7}
    >
      <Card variant="elevated" style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <Avatar name={`${item.firstName} ${item.lastName}`} size="lg" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.contactCompany}>{item.company}</Text>
            {item.position && (
              <Text style={styles.contactPosition}>{item.position}</Text>
            )}
          </View>
          <Badge label={item.status} variant={item.status} size="sm" />
        </View>

        <View style={styles.contactMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="mail-outline"
              size={16}
              color={theme.textSecondary}
            />
            <Text style={styles.metaText}>{item.email}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="call-outline"
              size={16}
              color={theme.textSecondary}
            />
            <Text style={styles.metaText}>{item.phone}</Text>
          </View>
        </View>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.contactActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleCall(item.phone);
            }}
          >
            <Ionicons name="call" size={20} color="#F46C24" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleSMS(item.phone);
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#F46C24" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleEmail(item.email);
            }}
          >
            <Ionicons name="mail" size={20} color="#F46C24" />
          </TouchableOpacity>
          {item.dealValue && (
            <View style={styles.dealValue}>
              <Ionicons name="cash-outline" size={16} color={theme.success} />
              <Text style={styles.dealValueText}>
                ${(item.dealValue / 1000).toFixed(0)}K
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Contacts</Text>
            <Text style={styles.subtitle}>
              {filteredContacts.length} contacts
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search contacts..."
          style={styles.searchBar}
        />

        {/* Contacts List */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <Text style={styles.subtitle}>Loading contacts...</Text>
          </View>
        ) : error ? (
          <EmptyState
            icon="alert-circle-outline"
            title="Contacts Update Error"
            message={error}
            actionLabel="Try Again"
            onAction={() => fetchContacts()}
          />
        ) : filteredContacts.length > 0 ? (
          <FlatList
            data={filteredContacts}
            renderItem={renderContactCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <EmptyState
            icon="people-outline"
            title="No contacts found"
            message={
              searchQuery
                ? "Try adjusting your search"
                : "Add your first contact to get started"
            }
            actionLabel={!searchQuery ? "Add Contact" : undefined}
            onAction={
              !searchQuery ? () => router.push("/add-contact") : undefined
            }
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/add-contact")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
    },
    container: {
      flex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingTop: (StatusBar.currentHeight || 0) + Spacing.md,
      paddingBottom: Spacing.md,
      backgroundColor: theme.primary,
      elevation: 4,
      shadowColor: "rgba(2, 8, 23, 0.2)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: Typography.fontSize.xxxl,
      fontWeight: Typography.fontWeight.bold,
      color: "#FFFFFF", // White text on orange
    },
    subtitle: {
      fontSize: Typography.fontSize.sm,
      color: "#FFFFFF",
      marginTop: 2,
      opacity: 0.9,
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
    contactCard: {
      marginBottom: Spacing.md,
    },
    contactHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: Spacing.md,
    },
    contactInfo: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    contactName: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.bold,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    contactCompany: {
      fontSize: Typography.fontSize.base,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    contactPosition: {
      fontSize: Typography.fontSize.sm,
      color: theme.textTertiary,
    },
    contactMeta: {
      marginBottom: Spacing.md,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.xs,
    },
    metaText: {
      fontSize: Typography.fontSize.sm,
      color: theme.textSecondary,
      marginLeft: Spacing.sm,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.xs,
      marginBottom: Spacing.md,
    },
    tag: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    tagText: {
      fontSize: Typography.fontSize.xs,
      color: theme.textSecondary,
      fontWeight: Typography.fontWeight.medium,
    },
    contactActions: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: Spacing.md,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: Spacing.sm,
    },
    dealValue: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "auto",
      backgroundColor: isDark ? theme.backgroundTertiary : "#E8F5E9",
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    dealValueText: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.semibold,
      color: theme.success,
      marginLeft: Spacing.xs,
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
    footerLoader: {
      paddingVertical: Spacing.md,
      alignItems: "center",
    },
  });
