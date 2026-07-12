import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, } from "react-native";

import { useEffect, useRef, } from "react";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";

interface Props {
    visible: boolean;
    review: string;
    rating: number;
    onChangeReview: (text: string) => void;
    onChangeRating: (rating: number) => void;
    onCancel: () => void;
    onAccept: () => void;
}

export default function ReviewModal({ visible, review, rating, onChangeReview, onChangeRating, onCancel, onAccept, }: Props) {
    const { t } = useTranslation();

    const scales = useRef(
        Array.from(
            { length: 5 },
            () => new Animated.Value(1)
        )
    ).current;

    useEffect(() => {
        scales.forEach((scale, index) => {
            if (index < rating) {
                Animated.sequence([
                    Animated.timing(scale, { toValue: 1.25, duration: 120, useNativeDriver: true, }),
                    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true, }),
                ]).start();
            }
        });
    }, [rating]);

    return (
        <Modal visible={visible} transparent animationType="fade" >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>
                        {t("leaveReview")}
                    </Text>

                    <Text style={styles.label}>
                        {t("review")}
                    </Text>

                    <TextInput
                        multiline
                        value={review}
                        onChangeText={onChangeReview}
                        style={styles.input}
                        placeholder={t("review")}
                        placeholderTextColor="rgba(38,39,48,.45)"
                    />

                    <Text style={styles.label}>
                        {t("rating")}
                    </Text>

                    <View style={styles.starRow}>
                        {
                            Array.from({ length: 5 }).map((_, index) => (
                                <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => onChangeRating(index + 1)} >
                                    <Animated.Text
                                        style={[
                                            styles.star, {
                                                transform: [{ scale: scales[index], },],
                                                color: index < rating ? "#FFD54A" : "#D9D9D9",
                                            },
                                        ]}
                                    >
                                        ★
                                    </Animated.Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    <View style={styles.legendRow}>
                        <Text style={styles.legend}>
                            1 • {t("couldBeBetter")}
                        </Text>

                        <Text style={styles.legend}>
                            5 • {t("excellent")}
                        </Text>
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={onCancel} >
                            <Text style={styles.cancelText}>
                                {t("cancel")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.acceptButton} activeOpacity={0.85} onPress={onAccept} >
                            <Text style={styles.acceptText}>
                                {t("accept")}
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
        backgroundColor: "rgba(0,0,0,.60)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    modal: {
        width: "100%",
        maxWidth: 430,
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 24,
    },

    title: {
        fontSize: 26,
        color: colors.title,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
        marginBottom: 10,
        textAlign: "center",
    },

    label: {
        marginBottom: 8,
        color: colors.text,
        fontWeight: "600",
        fontSize: 18,
    },

    input: {
        minHeight: 130,
        borderWidth: 1,
        borderColor: "rgba(38,39,48,.15)",
        borderRadius: 15,
        padding: 12,
        fontSize: 16,
        color: colors.text,
        textAlignVertical: "top",
        marginBottom: 20,
    },

    starRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
    },

    star: {
        fontSize: 42,
    },

    legendRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    legend: {
        color: colors.textMuted,
        fontSize: 14,
    },

    buttons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },

    cancelButton: {
        flex: 1,
        height: 56,
        borderRadius: 15,
        backgroundColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
    },

    acceptButton: {
        flex: 1,
        height: 56,
        borderRadius: 15,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    cancelText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "700",
    },

    acceptText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
    },
})