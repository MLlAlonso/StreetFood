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
  });