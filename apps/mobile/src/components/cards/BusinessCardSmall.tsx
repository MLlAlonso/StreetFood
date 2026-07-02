import { View, Text, Image, StyleSheet, TouchableOpacity,} from "react-native";

import { useRouter } from "expo-router";
import { Business } from "@/modules/customer/types/Business";
import { colors } from "@/styles/theme/colors";
interface Props { business: Business; }

export default function BusinessCardSmall({ business, }: Props) {
    const router = useRouter();
    const starIcon = require("@/assets/icons/star.png");

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => router.push( `/business/${business.id}` )}
        >
            <View>
                <Image source={{ uri: business.logo, }} style={styles.image} />

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {
                            business.business_type === "food_truck"
                                ? "Food Truck"
                                : "Restaurant"
                        }
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.title} >
                    {business.business_name}
                </Text>

                <View style={styles.rating}>
                    <Image source={starIcon} style={styles.star} />

                    <Text style={styles.ratingText}>
                        {business.rating}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        minHeight: 200,
        backgroundColor: colors.card,
        borderRadius: 15,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: colors.border,
    },

    image: {
        width: "100%",
        height: 120,
    },

    badge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

    badgeText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },

    content: {
        padding: 12,
    },

    title: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: "700",
    },

    rating: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 6,
    },

    star: {
        width: 20,
        height: 20,
    },

    ratingText: {
        color: colors.textMuted,
        fontSize: 16,
    },
});