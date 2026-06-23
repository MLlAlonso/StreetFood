import { View, Text, Image, StyleSheet, } from "react-native";

import { Business } from "@/modules/customer/types/Business";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";

interface Props { business: Business; }

export default function BusinessCardLarge({ business, }: Props) {
    const starIcon = require("@/assets/icons/star.png");
    const truckIcon = require("@/assets/icons/foodtruck.png");
    const restaurantIcon = require("@/assets/icons/restaurant2.png");

    return (
        <View style={styles.card}>
            <Image source={{ uri: business.logo, }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.row} >
                    <View style={styles.left} >
                        <Text style={styles.title} >
                            {business.business_name}
                        </Text>

                        <Text style={styles.subtitle} >
                            {
                                business.business_type === "food_truck"
                                    ? "Food Truck"
                                    : "Restaurant"
                            }

                            {" • "}

                            {business.distance}km
                        </Text>

                        <View style={styles.ratingRow} >
                            <Image source={starIcon} style={styles.star} />

                            <Text style={styles.subtitle} >
                                {business.rating}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tags} >
                        {
                            business.categories.map(
                                tag => (
                                    <View key={tag} style={styles.tag} >
                                        <Text style={styles.tagText} >
                                            {tag}
                                        </Text>
                                    </View>
                                )
                            )
                        }
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: colors.card,
        borderRadius: 15,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: colors.border,
    },

    image: {
        width: "100%",
        height: 220,
    },

    content: {
        padding: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    left: {
        flex: 1,
    },

    title: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: typography.weight.bold as any,
    },

    subtitle: {
        color: colors.textMuted,
        marginTop: 4,
    },

    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 10,
    },

    star: {
        width: 20,
        height: 20,
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        gap: 6,
        maxWidth: 140,
    },

    tag: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.secondary,
    },

    tagText: {
        fontSize: 14,
        color: "#FFF",
    },
});