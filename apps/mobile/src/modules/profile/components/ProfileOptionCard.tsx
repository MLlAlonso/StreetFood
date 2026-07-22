import { TouchableOpacity, View, Text, Image, StyleSheet, } from "react-native";

import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";

interface Props {
    title: string;
    icon: any;
    onPress: () => void;
}

export default function ProfileOptionCard({ title, icon, onPress, }: Props) {

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress} >
            <View style={styles.left}>
                <Image source={icon} style={styles.icon} resizeMode="contain" />

                <Text style={styles.title}>
                    {title}
                </Text>
            </View>

            <Image source={require("@/assets/icons/arrow-left.png")} style={styles.arrow} resizeMode="contain" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    icon: {
        width: 30,
        height: 30,
    },

    arrow: {
        width: 20,
        height: 20,
        transform: [{ rotate: "180deg" }],
        opacity: .55,
    },

    title: {
        marginLeft: spacing.md,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
        color: colors.text,
    },
});