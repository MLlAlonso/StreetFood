import { StyleSheet } from "react-native";

import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: spacing.lg,
        paddingBottom: 10,
    },

    center: {
        alignItems: "center",
        marginBottom: spacing.xl,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: colors.card,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.sm,
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 55,
    },

    name: {
        fontFamily: typography.fontFamily.title,
        fontSize: typography.size.xl,
        color: colors.title,
    },

    email: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
    },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },

    cardTitle: {
        fontFamily: typography.fontFamily.title,
        fontSize: typography.size.lg,
        color: colors.title,
    },

    field: {
        marginBottom: spacing.md,
    },

    label: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
    },

    value: {
        color: colors.text,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
    },

    /* Modal edit perfil */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.lg,
    },

    editModal: {
        width: "100%",
        maxWidth: 550,
        maxHeight: "92%",
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: spacing.lg,
    },

    modalTitle: {
        fontFamily: typography.fontFamily.title,
        fontSize: typography.size.xl,
        color: colors.title,
        textAlign: "center",
        marginBottom: spacing.lg,
    },

    avatarContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        alignSelf: "center",
        backgroundColor: colors.card,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: spacing.sm,
    },

    editAvatar: {
        width: "100%",
        height: "100%",
    },

    emptyAvatar: {
        width: 60,
        height: 60,
        opacity: .55,
    },

    removeAvatar: {
        alignSelf: "center",
        color: colors.danger,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        marginBottom: spacing.sm,
    },

    inputLabel: {
        marginBottom: spacing.sm,
        marginTop: spacing.md,
        color: colors.title,
        fontFamily: typography.fontFamily.title,
        fontSize: typography.size.sm,
    },

    languageContainer: {
        flexDirection: "row",
        gap: spacing.md,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },

    languageButton: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },

    languageButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    languageText: {
        color: colors.text,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
    },

    languageTextActive: {
        color: "#FFF",
        fontFamily: typography.fontFamily.title,
    },

    modalButtons: {
        marginTop: spacing.md,
        gap: spacing.sm,
    },
});