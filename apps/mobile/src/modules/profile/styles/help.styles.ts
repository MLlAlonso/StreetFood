
import { StyleSheet } from "react-native";
import { colors } from "@/styles/theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 20,
        paddingBottom: 20,
        gap: 20,
    },

    tabletContent: {
        paddingHorizontal: 28,
        gap: 28,
    },

    desktopContent: {
        width: "100%",
        maxWidth: 1400,
        alignSelf: "center",
        paddingHorizontal: 40,
        paddingTop: 30,
        paddingBottom: 40,
        gap: 30,
    },

    /* HEADER */

    pageHeader: {
        gap: 10,
        maxWidth: 780,
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 2,
        color: colors.secondary,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.primary,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 25,
        color: colors.textMuted,
    },

    /* SECTIONS */
    sections: {
        gap: 14,
    },

    sectionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: 18,
    },

    /* CARDS */
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E7EBEF",
    },

    cardGrid: {
        width: "48%",
        flexGrow: 1,
        flexBasis: "45%",
        minWidth: 280,
        padding: 22,
        gap: 16,
    },

    numberContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#EAF1F7",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    number: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.primary,
    },

    cardContent: {
        flex: 1,
        gap: 7,
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.primary,
    },

    cardDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.textMuted,
    },

    /* FOOTER */
    footerCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#EAF1F7",
        gap: 8,
    },

    footerTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.primary,
    },

    footerDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.primary,
    },

    contactEmail: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.primary,
        marginTop: 4,
    },
});