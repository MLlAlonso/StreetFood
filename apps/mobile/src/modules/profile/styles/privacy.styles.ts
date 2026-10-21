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

    tabletContent: {
        paddingHorizontal: 28,
        gap: 28,
    },

    desktopContent: {
        width: "100%",
        maxWidth: 1400,
        alignSelf: "center",
        paddingHorizontal: 44,
        paddingTop: 30,
        paddingBottom: 40,
        gap: 32,
    },

    /* HEADER */

    pageHeader: {
        gap: 10,
        maxWidth: 800,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.primary,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.text,
    },

    /* PRIVACY NOTICE */

    notice: {
        flexDirection: "row",
        backgroundColor: "#EAF1F7",
        borderRadius: 16,
        overflow: "hidden",
        gap: 0,
    },

    desktopNotice: {
        borderRadius: 20,
    },

    noticeAccent: {
        width: 4,
        backgroundColor: colors.primary,
    },

    noticeContent: {
        flex: 1,
        padding: 20,
        gap: 8,
    },

    noticeEyebrow: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.5,
        color: colors.secondary,
    },

    noticeTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.primary,
    },

    noticeDescription: {
        fontSize: 14,
        textAlign: "justify",
        lineHeight: 22,
        color: colors.primary,
    },

    /* SECTION GRID */
    sections: {
        gap: 12,
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
        padding: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
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

    desktopCard: {
        borderRadius: 18,
        padding: 24,
        borderColor: "#E2E8EE",
    },

    sectionNumberContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#EAF1F7",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    sectionNumber: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.primary,
    },

    cardContent: {
        flex: 1,
        gap: 8,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.primary,
    },

    cardDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
    },

    /* FOOTER */

    footerContainer: {
        gap: 8,
        paddingTop: 4,
    },

    footerLabel: {
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 2,
        color: colors.secondary,
    },

    footer: {
        fontSize: 14,
        textAlign: "justify",
        lineHeight: 20,
        color: colors.textMuted,
    },
});
