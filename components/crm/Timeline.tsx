import { useTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface TimelineItemProps {
  icon: string;
  iconType?: "ionicons" | "material";
  iconBg: string;
  time: string;
  title: string;
  description?: string;
  isLast?: boolean;
}

const TimelineItem = ({
  icon,
  iconType = "ionicons",
  iconBg,
  time,
  title,
  description,
  isLast,
  styles,
}: TimelineItemProps & { styles: any }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.leftColumn}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          {iconType === "ionicons" ? (
            <Ionicons name={icon as any} size={16} color="#fff" />
          ) : (
            <MaterialCommunityIcons name={icon as any} size={16} color="#fff" />
          )}
        </View>
        {!isLast && <View style={styles.verticalLine} />}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.itemTitle}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
};

export const Timeline = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>TIMELINE</Text>
      <View style={styles.list}>
        <TimelineItem
          icon="attach"
          iconBg="#9b59b6"
          time="Today 10:26 AM"
          title="ACME Residences Brochure"
          description="Last opened just now\nViewed 2 times for 5m 11s"
          styles={styles}
        />
        <TimelineItem
          icon="chatbox"
          iconBg="#3498db"
          time="Jul 21 2:07 PM"
          title="Introduction - ACME Residences"
          description="Hi Katherine, this is Aaron from ACME Corporation. Thanks for the call just now! Here is the brochure..."
          styles={styles}
        />
        <TimelineItem
          icon="person-add"
          iconBg="#7f8c8d"
          time="Jul 21 2:07 PM"
          title="Client added to Privyr"
          description="Imported from phonebook"
          isLast={true}
          styles={styles}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
      flex: 1,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.textSecondary,
      letterSpacing: 1,
      marginBottom: 20,
    },
    list: {
      marginLeft: 5,
    },
    itemContainer: {
      flexDirection: "row",
      minHeight: 80,
    },
    leftColumn: {
      alignItems: "center",
      width: 40,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    verticalLine: {
      width: 1,
      backgroundColor: theme.border,
      position: "absolute",
      top: 32,
      bottom: 0,
      left: 19.5,
    },
    contentContainer: {
      flex: 1,
      paddingLeft: 10,
      paddingBottom: 25,
    },
    time: {
      fontSize: 13,
      color: theme.textTertiary,
      marginBottom: 4,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
  });
