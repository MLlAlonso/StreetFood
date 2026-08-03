import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container: {
        marginTop: 30,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },

    subtitle: {
        color: "#777",
        marginBottom: 18,
    },

    card: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        position: "relative",
        zIndex: 1,
    },

    label: {
        fontWeight: "600",
        marginBottom: 8,
    },

    dropdown: {
        height: 48,
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
        backgroundColor: "#FFF",
    },

    dropdownText: {
        fontSize: 15,
    },

    arrow: {
        fontSize: 12,
    },

    dropdownMenu: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        marginTop: -12,
        marginBottom: 15,
        overflow: "hidden",
        backgroundColor: "#FFF",
    },

    option: {
        paddingHorizontal: 15,
        paddingVertical: 12,
    },

    optionDisabled: {
        backgroundColor: "#F5F5F5",
    },

    optionText: {
        fontSize: 15,
    },

    optionTextDisabled: {
        color: "#BBB",
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        paddingHorizontal: 12,
    },

    removeButton: {
        alignSelf: "flex-end",
        marginTop: 12,
    },

    removeText: {
        color: "#D32F2F",
        fontWeight: "600",
    },

    addButton: {
        height: 48,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#AAA",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    addText: {
        fontWeight: "600",
    },

});