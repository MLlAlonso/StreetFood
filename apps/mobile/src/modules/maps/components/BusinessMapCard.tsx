import { View, Text, Image, StyleSheet, TouchableOpacity, } from "react-native";
import { useRouter } from "expo-router";
import type { NearbyBusiness } from "@/modules/maps/types/LiveLocation";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";
interface Props { business: NearbyBusiness; onClose: () => void; }

export default function BusinessMapCard({ business, onClose, }: Props) {
    const router = useRouter();
    const { t } = useTranslation();
    const isOpen = business.status === "open";
    const imageUri = business.logo || business.image;

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => router.push(`/business/${business.id}`)}  >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.placeholderText}>
                            {business.business_type === "food_truck" ? "Food Truck" : "Restaurant"}
                        </Text>
                    </View>
                )}

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={1} >
                            {business.business_name}
                        </Text>

                        <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel={t("closeMapCard")} >
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        {business.business_type === "food_truck" ? t("foodTruck") : t("restaurant")}
                    </Text>

                    <View style={styles.details}>
                        <View style={[styles.statusBadge, isOpen ? styles.openBadge : styles.closedBadge,]} >
                            <View style={[styles.statusDot, isOpen ? styles.openDot : styles.closedDot,]} />

                            <Text style={[styles.statusText, isOpen ? styles.openText : styles.closedText,]} >
                                {isOpen ? t("open") : t("closed")}
                            </Text>
                        </View>

                        <Text style={styles.distance}>
                            {business.distance.toFixed(1)} {t("km")}
                        </Text>

                        <Text style={styles.rating}>
                            ★ {business.rating ?? 0}
                        </Text>
                    </View>

                    <Text style={styles.tapHint}>
                        {t("viewBusinessProfile")}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    card: {
        flexDirection: "row",
        backgroundColor: colors.card,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },

    image: {
        width: 120,
        height: 145,
    },

    imagePlaceholder: {
        backgroundColor: colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
    },

    placeholderText: {
        color: "#FFF",
        textAlign: "center",
    },

    content: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        flex: 1,
        color: colors.primary,
        fontSize: 20,
        fontWeight: typography.weight.bold as any,
    },

    closeButton: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    closeText: {
        fontSize: 28,
        color: colors.textMuted,
        lineHeight: 28,
    },

    subtitle: {
        color: colors.textMuted,
        marginTop: 3,
        fontSize: 14,
    },

    details: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 10,
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5,
    },

    openBadge: {
        backgroundColor: "#E6F6ED",
    },

    closedBadge: {
        backgroundColor: "#F1F1F1",
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },

    openDot: {
        backgroundColor: "#1C8F6A",
    },

    closedDot: {
        backgroundColor: "#8A8A8A",
    },

    statusText: {
        fontSize: 14,
        fontWeight: "600",
    },

    openText: {
        color: "#1C8F6A",
    },

    closedText: {
        color: "#666",
    },

    distance: {
        color: colors.textMuted,
        fontSize: 14,
    },

    rating: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "600",
    },

    tapHint: {
        marginTop: 10,
        color: colors.textMuted,
        fontSize: 14,
    },
});