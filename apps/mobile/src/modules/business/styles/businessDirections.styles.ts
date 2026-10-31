import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FA",
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    header: {
        marginBottom: 24,
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        marginBottom: 12,
    },
    backButtonText: {
        color: "#1677FF",
        fontSize: 15,
        fontWeight: "600",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#17191C",
    },
    subtitle: {
        fontSize: 14,
        color: "#737980",
        marginTop: 5,
    },
    loadingContainer: {
        minHeight: 350,
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
    },
    loadingText: {
        fontSize: 14,
        color: "#737980",
    },
    errorContainer: {
        minHeight: 300,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        gap: 12,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#17191C",
        textAlign: "center",
    },
    errorText: {
        fontSize: 14,
        color: "#737980",
        textAlign: "center",
        lineHeight: 21,
    },
    retryButton: {
        backgroundColor: "#1677FF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    routeSummary: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        gap: 12,
    },
    summaryItem: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 12,
        color: "#737980",
        marginBottom: 6,
    },
    summaryValue: {
        fontSize: 21,
        fontWeight: "700",
        color: "#17191C",
    },
    summaryDivider: {
        width: 1,
        height: 42,
        backgroundColor: "#E6E8EB",
    },
    destinationNotice: {
        backgroundColor: "#EAF2FF",
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
    },
    destinationNoticeText: {
        fontSize: 13,
        color: "#24589B",
        lineHeight: 19,
    },
    mapContainer: {
        width: "100%",
        height: 480,
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "#E8EAED",
    },
});
