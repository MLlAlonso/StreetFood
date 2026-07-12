import { View, Text, Image, StyleSheet, Animated, } from "react-native";

import { useEffect, useRef, } from "react";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { formatRelativeDate } from "@/utils/date";

interface Props {
    name: string;
    avatar?: string | null;
    comment: string;
    rating: number;
    createdAt: string;
}

export default function ReviewCard({ name, avatar, comment, rating, createdAt, }: Props) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(25)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,

            }),

            Animated.timing(translateY, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, index) => (
            <Text key={index} style={[styles.star, { color: index < rating ? "#FFD54A" : "#D9D9D9", },]}>
                ★
            </Text>
        ));
    };

    return (
        <Animated.View style={[styles.card, { opacity, transform: [{ translateY, },], },]} >
            <View style={styles.header}>
                <View style={styles.userSection}>
                    {
                        avatar ?
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                            :
                            <View style={styles.placeholderAvatar}>
                                <Text style={styles.placeholderText}>
                                    {name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                    }

                    <View>
                        <Text style={styles.name}>
                            {name}
                        </Text>

                        <Text style={styles.date}>
                            {formatRelativeDate(createdAt)}
                        </Text>
                    </View>
                </View>

                <Text style={styles.ratingValue}>
                    {rating.toFixed(1)}
                </Text>
            </View>

            <View style={styles.starsRow}>
                {renderStars()}
            </View>

            <Text style={styles.comment}>
                "{comment}"
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 18,
        margin: 15,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4, },
        elevation: 4,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    userSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
    },

    placeholderAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    placeholderText: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "700",
    },

    name: {
        color: colors.title,
        fontSize: 18,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    date: {
        color: colors.textMuted,
        fontSize: 13,
    },

    starsRow: {
        flexDirection: "row",
        marginTop: 5,
    },

    star: {
        fontSize: 28,
        marginRight: 2,
    },

    ratingValue: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: "700",
    },

    comment: {
        marginTop: 5,
        color: colors.text,
        lineHeight: 24,
        fontSize: 18,
    },
})