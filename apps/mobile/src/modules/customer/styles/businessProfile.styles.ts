import { StyleSheet, } from "react-native";
import { colors, } from "@/styles/theme/colors";
import { typography, } from "@/styles/theme/typography";

export const styles = StyleSheet.create({
    /* GENERAL */
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },

    /* ------------------------- */
    /* HERO */
    /* ------------------------- */
    hero: {
        width: "100%",
        position: "relative",
    },

    heroImage: {
        width: "100%",
        height: 200,
    },

    heroOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 4,
        backgroundColor: "rgba(0,0,0,0.30)",
    },

    businessName: {
        color: "#FFF",
        fontSize: 30,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    businessType: {
        marginTop: 5,
        marginHorizontal: 20,
        color: colors.textMuted,
        fontSize: 18,
        fontWeight: "600",
    },

    /* ------------------------- */
    /* STATS */
    /* ------------------------- */
    statsCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(127,126,126,0.40)",
        borderRadius: 15,
        flexDirection: "row",
        overflow: "hidden",
        backgroundColor: "#FFF",
    },

    statItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: "rgba(127,126,126,0.25)",
    },

    statValue: {
        color: colors.primary,
        fontSize: 26,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    statLabel: {
        marginTop: 6,
        color: colors.textMuted,
        fontSize: 16,
    },

    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    /* ------------------------- */
    /* BUTTON */
    /* ------------------------- */
    editButton: {
        marginHorizontal: 20,
        marginTop: 22,
        height: 58,
        borderRadius: 15,
        backgroundColor: colors.primary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    editIcon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
        marginRight: 10,
    },

    editText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: typography.weight.bold as any,
    },

    profileButtonsRow: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 22,
        gap: 12,
    },

    directionButton: {
        flex: 1,
        height: 58,
        borderRadius: 15,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    rateButton: {
        flex: 1,
        height: 58,
        borderRadius: 15,
        backgroundColor: colors.tertiary,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    directionIcon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
        marginRight: 8,
    },

    directionText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: typography.weight.bold as any,
    },

    /* ------------------------- */
    /* TITLES */
    /* ------------------------- */
    sectionTitle: {
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 5,
        color: colors.primary,
        fontSize: 26,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    /* ------------------------- */
    /* DESCRIPTION */
    /* ------------------------- */
    description: {
        marginHorizontal: 20,
        color: colors.text,
        fontSize: 16,
        lineHeight: 25,
    },

    /* ------------------------- */
    /* MENU */
    /* ------------------------- */
    menuContainer: {
        marginHorizontal: 20,
        marginBottom: 10,
    },

    seeMoreReviews: {
        marginTop: 15,
        marginBottom: 15,
        textAlign: "center",
        color: colors.primary,
        fontWeight: "700",
        fontSize: 16,
    },

    /* ------------------------- */
    /* TABLET */
    /* ------------------------- */
    heroTablet: {
        height: 360,
    },

    businessNameTablet: {
        fontSize: 38,
    },

    statsTablet: {
        marginHorizontal: 50,
    },

    buttonTablet: {
        marginHorizontal: 50,
    },

    sectionTablet: {
        marginHorizontal: 50,
    },

    /* ------------------------- */
    /* DESKTOP */
    /* ------------------------- */
    desktopWrapper: {
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
    },

    heroDesktop: {
        height: 430,
        borderRadius: 18,
        overflow: "hidden",
    },

    businessNameDesktop: {
        fontSize: 48,
    },

    statsDesktop: {
        marginHorizontal: 120,
    },

    buttonDesktop: {
        marginHorizontal: 120,
    },

    sectionDesktop: {
        marginHorizontal: 120,
    },

    /* ------------------------- */
    /* ACTION BUTTONS */
    /* ------------------------- */
    actionsContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        gap: 10,
    },

    actionButton: {
        flex: 1,
        height: 50,
        borderRadius: 15,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    whatsappButton: {
        backgroundColor: "#25D366",
    },

    actionIcon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },

    favoriteButton: {
        position: "absolute",
        right: 18,
        width: 50,
        height: 50,
        borderRadius: 24,
        backgroundColor: "rgba(0,0,0,0.30)",
        justifyContent: "center",
        alignItems: "center",
    },

    favoriteIcon: {
        width: 35,
        height: 35,
    },




    ownerActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },

    statusBadge: {
        alignSelf: "flex-start",
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 50,
    },

    statusOpen: {
        backgroundColor: "#22C55E",
    },

    statusClosed: {
        backgroundColor: "#EF4444",
    },

    statusBadgeText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 12,
    },

    statusButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14,
    },

    openButton: {
        backgroundColor: "#16A34A",
    },

    closeButton: {
        backgroundColor: "#DC2626",
    },

    statusButtonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 14,
    },
});