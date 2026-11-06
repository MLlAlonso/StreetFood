import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, } from "react-native";

import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/search/SearchBar";
import BottomTabs from "@/components/layout/BottomTabs";
import BusinessCardLarge from "@/components/cards/BusinessCardLarge";
import BusinessCardSmall from "@/components/cards/BusinessCardSmall";
import CategoryScroller from "@/components/categories/CategoryScroller";
import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";
import type { Business } from "@/modules/customer/types/Business";
import { getCurrentCoordinates } from "@/modules/maps/services/deviceLocation.service";
import { getNearbyBusinesses } from "@/modules/maps/services/location.service";
import { mapNearbyBusinesses } from "@/modules/explore/utils/mapNearbyBusinesses";
import { rankTrendingBusinesses } from "@/modules/explore/utils/trendingBusinesses";
import { useTranslation } from "@/translations/hooks/useTranslation";

export default function MainScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [nearbyError, setNearbyError] = useState<string | null>(null);
    const { isTablet, isDesktop } = useResponsive();

    const loadBusinesses = useCallback(async () => {
        setLoading(true);
        setNearbyError(null);

        try {
            const coordinates = await getCurrentCoordinates();
            const result = await getNearbyBusinesses(coordinates, 60, 12);
            const mappedBusinesses = mapNearbyBusinesses(result.businesses);
            setNearbyBusinesses(mappedBusinesses);
        } catch (error) {
            console.error("Error loading nearby businesses:", error);
            setNearbyBusinesses([]);
            const message = error instanceof Error ? error.message : "NEARBY_BUSINESSES_FAILED";
            setNearbyError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadBusinesses();
        }, [loadBusinesses])
    );

    const matchesFilters = (business: Business) => {
        const matchSearch = business.business_name.toLowerCase().includes(search.trim().toLowerCase());
        const matchCategory = !selectedCategory || business.categories.includes(selectedCategory);
        return matchSearch && matchCategory;
    };

    // Cerca de ti: primeros 9 negocios por distancia.
    const filteredBusinesses = nearbyBusinesses.filter(matchesFilters).slice(0, 9);

    // Trending: primero se limita el conjunto a los 12 más cercanos. Después se aplica el ranking original de Trending.
    const trendingBusinesses = rankTrendingBusinesses(nearbyBusinesses).filter(matchesFilters).slice(0, 12);

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <SearchBar value={search} onChangeText={setSearch} />
                <CategoryScroller selected={selectedCategory} onSelect={setSelectedCategory} showMore />

                {loading && (
                    <ActivityIndicator size="large" color={colors.primary} />
                )}

                {!loading && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                {t("openNearby")}
                            </Text>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/business/nearby")} >
                                <Text style={styles.showMore}>
                                    {t("showMore")}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {nearbyError ? (
                            <Text style={styles.infoText}>
                                {nearbyError === "LOCATION_PERMISSION_DENIED" ? t("nearbyLocationPermissionRequired") : t("nearbyLoadError")}
                            </Text>
                        ) : filteredBusinesses.length > 0 ? (
                            <View style={styles.largeGrid}>
                                {filteredBusinesses.map((business) => (
                                    <View
                                        key={`large-${business.id}`}
                                        style={[styles.largeWrapper, isTablet && styles.largeWrapperTablet, isDesktop && styles.largeWrapperDesktop,]}
                                    >
                                        <BusinessCardLarge business={business} />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.infoText}>
                                {t("noNearbyBusinesses")}
                            </Text>
                        )}

                        {!nearbyError && trendingBusinesses.length > 0 && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>
                                        {t("trending")}
                                    </Text>

                                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/business/trending")} >
                                        <Text style={styles.showMore}>
                                            {t("showMore")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.smallGrid, isTablet && styles.smallGridTablet, isDesktop && styles.smallGridDesktop,]} >
                                    {trendingBusinesses.map((business) => (
                                        <View
                                            key={`small-${business.id}`}
                                            style={[styles.smallWrapper, isTablet && styles.smallWrapperTablet, isDesktop && styles.smallWrapperDesktop,]}
                                        >
                                            <BusinessCardSmall business={business} />
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            <BottomTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 20,
        gap: 20,
        paddingBottom: 120,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.primary,
    },

    infoText: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: "center",
        paddingVertical: 16,
    },

    /* LARGE CARDS */
    largeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -8,
    },

    largeWrapper: {
        width: "100%",
        paddingHorizontal: 8,
        marginBottom: 16,
    },

    largeWrapperTablet: {
        width: "50%",
    },

    largeWrapperDesktop: {
        width: "33.333%",
    },

    /* SMALL CARDS */
    smallGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -6,
    },

    smallGridTablet: {
        justifyContent: "space-between",
    },

    smallGridDesktop: {
        justifyContent: "space-between",
    },

    smallWrapper: {
        width: "50%",
        paddingHorizontal: 6,
        marginBottom: 12,
    },

    smallWrapperTablet: {
        width: "25%",
    },

    smallWrapperDesktop: {
        width: "16.666%",
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    showMore: {
        color: colors.textMuted,
        fontSize: 15,
        fontWeight: "600",
    },
});