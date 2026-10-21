
import { StyleSheet } from "react-native";
import { colors } from "@/styles/theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    /* PAGE LAYOUT */
    content: {
        padding: 20,
        paddingBottom: 20,
        gap: 20,
    },

    desktopContent: {
        width: "100%",
        maxWidth: 1400,
        alignSelf: "center",
        paddingHorizontal: 40,
        paddingTop: 32,
        paddingBottom: 40,
        gap: 28,
    },

    /* HERO */
    hero: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: colors.primary,
        gap: 14,
        overflow: "hidden",
    },

    brand: {
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 4,
        color: "#FFFFFF",
    },

    heroTitle: {
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "800",
        color: "#FFFFFF",
    },

    heroDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: "#E8EDF2",
    },

    /* INTRODUCTION */
    introCard: {
        padding: 22,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E7EBEF",
        gap: 12,
    },

    sectionTitle: {
        fontSize: 24,
        lineHeight: 28,
        fontWeight: "800",
        color: colors.primary,
    },

    description: {
        fontSize: 14,
        lineHeight: 23,
        color: colors.text,
    },

    /* VALUES */

    values: {
        gap: 12,
    },

    valueCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E7EBEF",
        gap: 10,
    },

    valueNumber: {
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 1.5,
        color: colors.secondary,
    },

    valueTitle: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: "800",
        color: colors.primary,
    },

    /* PLATFORMS */

    availabilityCard: {
        padding: 22,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        gap: 14,
        borderWidth: 1,
        borderColor: "#E7EBEF",
    },

    platformList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },

    platformItem: {
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: 10,
        backgroundColor: "#EAF1F7",
    },

    platformName: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.primary,
    },

    /* MISSION */

    missionCard: {
        padding: 22,
        borderRadius: 18,
        backgroundColor: "#EAF1F7",
        gap: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },

    missionTitle: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "800",
        color: colors.primary,
    },

    missionDescription: {
        fontSize: 14,
        lineHeight: 23,
        color: colors.primary,
    },














    /* RESPONSIVE: TABLET */

    tabletContent: {
        paddingHorizontal: 28,
        gap: 24,
    },

    valuesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: 14,
    },

    valueCardGrid: {
        flex: 1,
        flexBasis: "45%",
        minWidth: 260,
    },

    /* RESPONSIVE: DESKTOP */

    desktopHero: {
        paddingHorizontal: 42,
        paddingVertical: 38,
        minHeight: 260,
        justifyContent: "center",
    },

    desktopHeroTitle: {
        fontSize: 42,
        lineHeight: 51,
        maxWidth: 780,
    },

    desktopIntroCard: {
        padding: 30,
    },

    desktopValuesGrid: {
        gap: 18,
    },

    desktopValueCard: {
        flexBasis: 0,
        minWidth: 0,
        padding: 24,
    },

    desktopAvailabilityCard: {
        padding: 30,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: 24,
    },

    desktopMissionCard: {
        padding: 30,
    },

});
