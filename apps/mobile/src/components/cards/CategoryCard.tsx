import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, } from "react-native";

import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";

interface Props { category: string; image: any; onPress: () => void; }

export default function CategoryCard({ category, image, onPress, }: Props) {

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress} >
            <ImageBackground source={image} style={styles.image} imageStyle={styles.imageRadius} resizeMode="cover" >
                <View style={styles.overlay} />

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {category}
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        aspectRatio: 1.6,
        borderRadius: 15,
        overflow: "hidden",
        backgroundColor: colors.card,
    },

    image: {
        width: "100%",
        height: "100%",
        justifyContent: "flex-start",
    },

    imageRadius: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.22)",
    },

    badge: {
        alignSelf: "flex-start",
        margin: 10,
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    badgeText: {
        color: "#FFF",
        fontSize: 15,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },
});