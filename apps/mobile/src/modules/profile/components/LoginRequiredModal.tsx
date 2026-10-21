import { Modal, View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, } from "react-native";

import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";

interface Props {
    visible: boolean;
    onCancel: () => void;
    onAccept: () => void;
    onLogin: () => void;
}

export default function LoginRequiredModal({ visible, onCancel, onAccept, onLogin, }: Props) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel} statusBarTranslucent >
            <View style={styles.overlay}>
                <View style={[styles.card, isDesktop && styles.cardDesktop,]}  >
                    <Text style={[styles.title, isDesktop && styles.titleDesktop,]} >
                        {t("loginRequired")}
                    </Text>

                    <Text style={styles.description}>
                        {t("profileLoginRequiredDescription")}
                    </Text>

                    <View style={[ styles.buttons, isDesktop && styles.buttonsDesktop, ]} >
                        <TouchableOpacity
                            style={[ styles.button,  styles.cancelButton, isDesktop && styles.buttonDesktop, ]}
                            onPress={onCancel}
                            activeOpacity={0.7}
                            accessibilityRole="button"
                        >
                            <Text style={styles.cancelText}>
                                {t("cancel")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[ styles.button, styles.loginButton, isDesktop && styles.buttonDesktop,  ]}
                            onPress={onLogin}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                        >
                            <Text style={styles.loginText}>
                                {t("login")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[ styles.button, styles.acceptButton, isDesktop && styles.buttonDesktop, ]}
                            onPress={onAccept}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                        >
                            <Text style={styles.acceptText}>
                                {t("createAccount")}
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },

    card: {
        width: "100%",
        maxWidth: 440,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: spacing.lg,
        ...Platform.select({
            web: {
                boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.16)",
            },
            default: {
                elevation: 8,
            },
        }),
    },

    cardDesktop: {
        maxWidth: 480,
        padding: spacing.xl,
        borderRadius: 18,
    },

    title: {
        fontSize: 20,
        lineHeight: 28,
        fontFamily: typography.fontFamily.title,
        color: colors.text,
        marginBottom: spacing.sm,
    },

    titleDesktop: {
        fontSize: 23,
        lineHeight: 31,
    },

    description: {
        fontSize: 15,
        lineHeight: 23,
        color: colors.textMuted,
        marginBottom: spacing.xl,
        fontFamily: typography.fontFamily.body,
    },

    buttons: {
        flexDirection: "column",
        alignItems: "stretch",
        gap: spacing.sm,
    },

    buttonsDesktop: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        flexWrap: "wrap",
        gap: spacing.sm,
    },

    button: {
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },

    buttonDesktop: {
        flexGrow: 0,
        flexShrink: 1,
    },

    cancelButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.border ?? "#E0E0E0",
    },

    cancelText: {
        color: colors.textMuted,
        fontSize: 14,
        fontFamily: typography.fontFamily.body,
        textAlign: "center",
    },

    loginButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
    },

    loginText: {
        color: colors.primary,
        fontSize: 14,
        fontFamily: typography.fontFamily.body,
        textAlign: "center",
    },

    acceptButton: {
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary,
    },

    acceptText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: typography.fontFamily.body,
        textAlign: "center",
    },
});