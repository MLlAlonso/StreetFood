import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";

interface Props {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ visible, title, message, onConfirm, onCancel,}: Props) {
    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>
                        {title}
                    </Text>

                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel} >
                            <Text style={styles.cancelText}>
                                {t("cancel")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.delete]} onPress={onConfirm} >
                            <Text style={styles.deleteText}>
                                {t("delete")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    modal: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 24,
    },

    title: {
        color: colors.title,
        fontSize: 24,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
        marginBottom: 12,
    },

    message: {
        color: colors.text,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },

    actions: {
        flexDirection: "row",
        gap: 12,
    },

    button: {
        flex: 1,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },

    cancel: {
        backgroundColor: "#E5E5E5",
    },

    delete: {
        backgroundColor: "#D32F2F",
    },

    cancelText: {
        color: "#333",
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    deleteText: {
        color: "#FFF",
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },
});