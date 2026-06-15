import { View, Text, Image, TouchableOpacity, StyleSheet,} from "react-native";

import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";

interface Props {
    image: string;
    title: string;
    description: string;
    onEdit: () => void;
    onDelete: () => void;
    editIcon: any;
    deleteIcon: any;
}

export default function MenuItemCard({
    image,
    title,
    description,
    onEdit,
    onDelete,
    editIcon,
    deleteIcon,
}: Props) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: image, }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.title} >
                        {title}
                    </Text>

                    <Text numberOfLines={2} style={styles.description} >
                        {description}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={onEdit} >
                        <Image source={editIcon} style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={onDelete} >
                        <Image source={deleteIcon} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },

    image: {
        width: 115,
        height: "100%",
        minHeight: 120,
    },

    content: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },

    textContainer: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        color: colors.primary,
        fontSize: 18,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
        marginBottom: 6,
    },

    description: {
        color: colors.textMuted,
        fontSize: 14,
        lineHeight: 20,
    },

    actions: {
        justifyContent: "center",
        gap: 10,
    },

    actionButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
});