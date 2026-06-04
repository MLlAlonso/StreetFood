import { StyleSheet } from "react-native";

import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { spacing } from "@/styles/theme/spacing";

export const createStyles = ( isDesktop: boolean, isTablet: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        wrapper: {
            flex: 1,
            width: "100%",
            alignSelf: "center",
            maxWidth: isDesktop
                ? 1600
                : isTablet
                    ? 900
                    : undefined,

            flexDirection:
                isDesktop
                    ? "row"
                    : "column",
        },

        /* -------------------------------- */
        /* HEADER                           */
        /* -------------------------------- */
        header: {
            backgroundColor: colors.primary,
            width:
                isDesktop
                    ? "45%"
                    : "100%",
            justifyContent: "center",
            paddingHorizontal:
                isDesktop
                    ? 80
                    : spacing.lg,
            paddingVertical:
                isDesktop
                    ? 80
                    : 40,
        },

        headerRow: {
            justifyContent: "center",
            alignItems:
                isDesktop
                    ? "flex-start"
                    : "center",
        },

        logo: {
            width:
                isDesktop
                    ? 420
                    : isTablet
                        ? 340
                        : 260,

            height:
                isDesktop
                    ? 130
                    : isTablet
                        ? 100
                        : 80,

            resizeMode: "contain",
            marginBottom: 30,
        },

        headerContent: {
            width: "100%",
        },

        title: {
            color: "#FFF",
            fontSize:
                isDesktop
                    ? 58
                    : isTablet
                        ? 46
                        : 34,

            lineHeight:
                isDesktop
                    ? 68
                    : 42,

            fontFamily: typography.fontFamily.title,
            fontWeight: typography.weight.bold as any,
        },

        subtitle: {
            marginTop: 10,
            color: "#FFF",
            opacity: 0.8,
            fontSize:
                isDesktop
                    ? 24
                    : typography.size.lg,

            lineHeight:
                isDesktop
                    ? 34
                    : 28,
        },

        /* -------------------------------- */
        /* FORM                            */
        /* -------------------------------- */
        content: {
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal:
                isDesktop
                    ? 100
                    : isTablet
                        ? 60
                        : spacing.lg,

            paddingVertical:
                isDesktop
                    ? 80
                    : 40,
        },

        formGroup: {
            marginBottom: 28,
        },

        label: {
            marginBottom: 12,
            color: colors.title,
            fontSize:
                isDesktop
                    ? 22
                    : 20,

            fontFamily: typography.fontFamily.title,
            fontWeight: typography.weight.bold as any,
        },

        forgotPassword: {
            alignSelf: "flex-end",
            marginTop: 12,
        },

        forgotPasswordText: {
            color: colors.primary,
            fontSize:
                isDesktop
                    ? 16
                    : 14,

            fontWeight: "700",
        },

        loginButton: {
            marginTop: 40,
            height:
                isDesktop
                    ? 72
                    : 60,

            borderRadius: 15,
            backgroundColor: colors.tertiary,
            justifyContent: "center",
            alignItems: "center",
        },

        loginButtonText: {
            color: "#FFF",
            fontSize:
                isDesktop
                    ? 24
                    : 20,

            fontFamily: typography.fontFamily.title,
            fontWeight: typography.weight.bold as any,
        },

        registerContainer: {
            marginTop: 25,
            alignItems: "center",
        },

        registerText: {
            color: colors.textMuted,
            textAlign: "center",
            fontSize:
                isDesktop
                    ? 18
                    : 16,
        },

        registerAction: {
            color: colors.primary,
            fontWeight: "700",
        },

        /* -------------------------------- */
        /* FOOTER                          */
        /* -------------------------------- */
        footer: {
            backgroundColor: colors.primary,

            ...(isDesktop
                ? {
                    width: "45%",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }
                : {
                    height: 70,
                    justifyContent: "center",
                    alignItems: "center",
                }),
        },

        guestButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },

        guestText: {
            color: colors.secondary,
            fontWeight: "700",
            textAlign: "center",
            fontSize:
                isDesktop
                    ? 24
                    : 16,
        },

        guestArrow: {
            marginLeft: 12,
            color: colors.secondary,
            fontSize:
                isDesktop
                    ? 28
                    : 18,

            fontWeight: "700",
        },
    });