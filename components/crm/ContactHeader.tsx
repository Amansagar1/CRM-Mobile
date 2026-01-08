import { useTheme } from "@/context/ThemeContext";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ActionButton = ({
  icon,
  type = "ionicons",
  onPress,
  styles,
}: {
  icon: string;
  type?: string;
  onPress?: () => void;
  styles: any;
}) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      {type === "ionicons" && (
        <Ionicons name={icon as any} size={24} color="#fff" />
      )}
      {type === "material" && (
        <MaterialCommunityIcons name={icon as any} size={24} color="#fff" />
      )}
      {type === "fontawesome" && (
        <FontAwesome name={icon as any} size={22} color="#fff" />
      )}
    </TouchableOpacity>
  );
};

export const ContactHeader = ({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email: string;
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCall = () => Linking.openURL(`tel:${phone}`);
  const handleSMS = () => Linking.openURL(`sms:${phone}`);
  const handleEmail = () => Linking.openURL(`mailto:${email}`);
  const handleWhatsApp = () => {
    const cleanPhone = phone.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.actionRow}>
        <ActionButton icon="call" onPress={handleCall} styles={styles} />
        <ActionButton
          icon="chatbubble-ellipses"
          onPress={handleSMS}
          styles={styles}
        />
        <ActionButton icon="mail" onPress={handleEmail} styles={styles} />
        <ActionButton
          icon="whatsapp"
          type="material"
          onPress={handleWhatsApp}
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
      backgroundColor: theme.background,
    },
    name: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 20,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 0,
      maxWidth: 250,
    },
    actionButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  });
