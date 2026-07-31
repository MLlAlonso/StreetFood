import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        marginTop: 24,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 4,
        color: "#666",
        fontSize: 13,
    },

    dayCard: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },

    dayHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dayTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    timeRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 18,
    },

    inputGroup: {
        flex: 1,
    },

    label: {
        marginBottom: 8,
        fontSize: 13,
        fontWeight: "600",
    },

    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
    },
});