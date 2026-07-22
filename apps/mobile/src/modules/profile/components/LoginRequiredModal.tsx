import { Modal, View, Text, TouchableOpacity, StyleSheet, } from "react-native";

import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";

interface Props {
    visible: boolean;
    onCancel: () => void;
    onAccept: () => void;
}

export default function LoginRequiredModal({ visible, onCancel, onAccept, }: Props) {
    return (
        <Modal transparent visible={visible} animationType="fade" >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        Login required
                    </Text>

                    <Text style={styles.description}>
                        Create an account to access your profile.
                    </Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel} >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.acceptButton} onPress={onAccept} >
                            <Text style={styles.acceptText}>
                                Create account
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
        backgroundColor: "rgba(0,0,0,.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.lg,
    },

    card: {
        width: "100%",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: spacing.lg,
    },

    title: {
        fontSize: 20,
        fontFamily: typography.fontFamily.title,
        color: colors.text,
        marginBottom: spacing.sm,
    },

    description: {
        color: colors.textMuted,
        marginBottom: spacing.lg,
        fontFamily: typography.fontFamily.body,
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    cancelButton: {
        marginRight: spacing.md,
    },

    cancelText: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
    },

    acceptButton: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },

    acceptText: {
        color: "#FFF",
        fontFamily: typography.fontFamily.body,
    },
});