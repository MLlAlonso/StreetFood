import { StyleSheet } from "react-native";

import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { spacing } from "@/styles/theme/spacing";

export const createStyles = (
  isDesktop: boolean,
  isTablet: boolean
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flexGrow: 1,
      justifyContent: "center",
      width: "100%",
      maxWidth: isDesktop
        ? 600
        : isTablet
          ? 500
          : undefined,

      alignSelf: "center",
      padding: spacing.lg,
    },

    title: {
      color: colors.title,
      textAlign: "center",
      fontSize: 34,
      fontWeight: "800",
      marginBottom: 12,
    },

    subtitle: {
      color: colors.textMuted,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 40,
    },

    label: {
      marginBottom: 10,
      color: colors.title,
      fontSize: 20,
      fontWeight: "700",
    },

    formGroup: {
      marginBottom: 24,
    },

    button: {
      height: 58,
      borderRadius: 15,
      backgroundColor: colors.tertiary,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },

    buttonText: {
      color: "#FFF",
      fontSize: 18,
      fontWeight: "700",
    },

    backButton: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 8,
      paddingVertical: 10,
      paddingLeft: 10,
      paddingRight: 18,
      backgroundColor: "#09233E",
      borderWidth: 1,
      borderColor: "#E0E6EA",
      borderRadius: 30,
      shadowColor: "#09233E",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 5,
      elevation: 2,
    },

    backButtonIcon: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: "#09233E",
      alignItems: "center",
      justifyContent: "center",
    },

    backButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffff",
      letterSpacing: 0.2,
    },
  });