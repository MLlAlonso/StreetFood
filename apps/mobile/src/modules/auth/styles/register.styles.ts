
import { StyleSheet } from "react-native";

import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";
import { radius } from "@/styles/theme/radius";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Header
    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingTop: 50,
        paddingBottom: 50,
    },

    headerTitle: {
        color: "#FFF",
        fontSize: typography.size.xxl,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    headerSubtitle: {
        marginTop: spacing.sm,
        color: "#FFF",
        opacity: 0.8,
        fontSize: typography.size.lg,
        fontFamily: typography.fontFamily.body,
        lineHeight: 28,
    },

    // ScrollView
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        flexGrow: 1,
    },

    desktopContent: {
        alignItems: "center",
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },

    tabletContent: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
    },

    // Form wrapper
    pageWrapper: {
        width: "100%",
        alignItems: "center",
    },

    desktopForm: {
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
    },

    tabletForm: {
        width: "100%",
        maxWidth: 700,
        alignSelf: "center",
    },

    // Rows
    row: {
        flexDirection: "row",
        gap: 15,
    },

    desktopRow: {
        justifyContent: "space-between",
    },

    // Form fields
    formGroup: {
        marginTop: 25,
    },

    label: {
        marginBottom: 10,
        color: colors.title,
        fontSize: 20,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    // Language selector
    languageButton: {
        flex: 1,
        height: 60,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },

    languageButtonActive: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },

    languageText: {
        color: colors.textMuted,
        fontSize: typography.size.md,
    },

    languageTextActive: {
        color: "#FFF",
        fontWeight: "700",
    },

    // Main action
    primaryButton: {
        height: 58,
        borderRadius: 15,
        backgroundColor: colors.tertiary,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },

    primaryButtonText: {
        color: "#FFF",
        fontSize: typography.size.lg,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    // Footer
    footerText: {
        textAlign: "center",
        marginTop: 25,
        color: colors.textMuted,
        fontSize: typography.size.md,
    },

    footerBold: {
        color: colors.title,
        fontWeight: "700",
    },

    // Business form controls
    textArea: {
        minHeight: 140,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "rgba(38,39,48,0.2)",
        borderRadius: 15,
        padding: 16,
        textAlignVertical: "top",
        color: colors.text,
    },

    inputButton: {
        height: 58,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "rgba(38,39,48,0.2)",
        borderRadius: 15,
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    inputButtonText: {
        color: "rgba(38,39,48,0.5)",
    },

    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    menuButton: {
        height: 80,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(38,39,48,0.2)",
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },

    plusCircle: {
        width: 45,
        height: 45,
        borderRadius: 999,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    plusText: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "700",
    },

    logoPreview: {
        width: "100%",
        height: 220,
        borderRadius: 20,
        marginTop: 16,
        backgroundColor: "#FFF",
    },

    removeLogoButton: {
        marginTop: 12,
        height: 52,
        borderRadius: 15,
        backgroundColor: colors.danger,
        justifyContent: "center",
        alignItems: "center",
    },

    removeLogoText: {
        color: "#FFF",
        fontSize: typography.size.md,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    backButton: {
        marginBottom: 20,
    },

    backText: {
        color: colors.secondary,
        fontSize: typography.size.md,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalImage: {
        width: "90%",
        height: "70%",
    },

    closeButton: {
        position: "absolute",
        top: 60,
        right: 25,
        zIndex: 100,
    },

    closeButtonText: {
        color: "#FFF",
        fontSize: 35,
        fontWeight: "700",
    },

    // Desktop header
    desktopHeader: {
        alignItems: "center",
        paddingTop: 36,
        paddingBottom: 36,
        paddingHorizontal: spacing.xl,
    },

    desktopTextCenter: {
        textAlign: "center",
    },

    formActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 40,
        alignItems: "center",
    },

    cancelButton: {
        flex: 1,
        height: 58,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },

    cancelButtonText: {
        color: colors.title,
        fontSize: typography.size.lg,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    saveButton: {
        flex: 1,
        marginTop: 0,
    },
});
