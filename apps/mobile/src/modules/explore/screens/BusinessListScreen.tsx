import { View, ScrollView, StyleSheet, Text, ActivityIndicator, } from "react-native";

import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import SearchBar from "@/components/search/SearchBar";
import CategoryScroller from "@/components/categories/CategoryScroller";
import BusinessCardLarge from "@/components/cards/BusinessCardLarge";
import BusinessCardSmall from "@/components/cards/BusinessCardSmall";
import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";
import type { Business } from "@/modules/customer/types/Business";
import { getCurrentCoordinates } from "@/modules/maps/services/deviceLocation.service";
import { getNearbyBusinesses } from "@/modules/maps/services/location.service";
import { mapNearbyBusinesses } from "@/modules/explore/utils/mapNearbyBusinesses";
import { rankTrendingBusinesses } from "@/modules/explore/utils/trendingBusinesses";
import { useTranslation } from "@/translations/hooks/useTranslation";

interface Props { mode: "nearby" | "trending"; }

export default function BusinessListScreen({ mode }: Props) {
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [nearbyError, setNearbyError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState(typeof params.category === "string" ? params.category : "");
    const { isTablet, isDesktop } = useResponsive();

    const loadBusinesses = useCallback(async () => {
        setLoading(true);
        setNearbyError(null);
        setBusinesses([]);

        try {
            const coordinates = await getCurrentCoordinates();

            // Cantidad de candidatos según la sección.
            const limit = mode === "nearby" ? 21 : 24;
            const result = await getNearbyBusinesses(coordinates, 60, limit);
            const mappedBusinesses = mapNearbyBusinesses(result.businesses);
            setBusinesses(mappedBusinesses);
        } catch (error) {
            console.error(`Error loading ${mode} businesses:`, error);
            setBusinesses([]);
            const message = error instanceof Error ? error.message : "NEARBY_BUSINESSES_FAILED";
            setNearbyError(message);
        } finally {
            setLoading(false);
        }
    }, [mode]);

    useEffect(() => { void loadBusinesses(); }, [loadBusinesses]);

    const matchesFilters = (business: Business) => {
        const matchSearch = business.business_name.toLowerCase().includes(search.trim().toLowerCase());
        const matchCategory = !selectedCategory || business.categories.includes(selectedCategory);
        return matchSearch && matchCategory;
    };

    // Nearby: los 21 negocios más cercanos.
    const nearbyBusinesses = businesses.filter(matchesFilters).slice(0, 21);

    // Trending: conserva el ranking original, pero únicamente entre los 24 negocios más cercanos.
    const trendingBusinesses = rankTrendingBusinesses(businesses).filter(matchesFilters).slice(0, 24);
    const hasBusinesses = mode === "trending" ? trendingBusinesses.length > 0 : nearbyBusinesses.length > 0;

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <SearchBar value={search} onChangeText={setSearch} />

                <CategoryScroller selected={selectedCategory} onSelect={setSelectedCategory} />

                {loading && (
                    <ActivityIndicator size="large" color={colors.primary} />
                )}

                {!loading && (
                    <>
                        {nearbyError ? (
                            <Text style={styles.emptyText}>
                                {nearbyError === "LOCATION_PERMISSION_DENIED" ? t("nearbyLocationPermissionRequired") : t("nearbyLoadError")}
                            </Text>
                        ) : (
                            <>
                                {mode === "nearby" && (
                                    <>
                                        <Text style={styles.sectionTitle}>
                                            {t("openNearby")}
                                        </Text>

                                        {hasBusinesses ? (
                                            <View style={styles.largeGrid}>
                                                {nearbyBusinesses.map((business) => (
                                                    <View
                                                        key={business.id}
                                                        style={[styles.largeWrapper, isTablet && styles.largeWrapperTablet, isDesktop && styles.largeWrapperDesktop,]}
                                                    >
                                                        <BusinessCardLarge
                                                            business={business}
                                                        />
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <Text style={styles.emptyText}>
                                                {t("noNearbyBusinesses")}
                                            </Text>
                                        )}
                                    </>
                                )}

                                {mode === "trending" && (
                                    <>
                                        <Text style={styles.sectionTitle}>
                                            {t("trending")}
                                        </Text>

                                        {hasBusinesses ? (
                                            <View style={[styles.smallGrid, isTablet && styles.smallGridTablet, isDesktop && styles.smallGridDesktop,]} >
                                                {trendingBusinesses.map((business) => (
                                                    <View
                                                        key={business.id}
                                                        style={[styles.smallWrapper, isTablet && styles.smallWrapperTablet, isDesktop && styles.smallWrapperDesktop,]}
                                                    >
                                                        <BusinessCardSmall business={business} />
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <Text style={styles.emptyText}>
                                                {t("noBusinessesYet")}
                                            </Text>
                                        )}
                                    </>
                                )}
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

    emptyText: {
        fontSize: 15,
        color: colors.textMuted,
        textAlign: "center",
        paddingVertical: 24,
    },

    /* LARGE */
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

    /* SMALL */
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
        marginBottom: 10,
    },

    smallWrapperTablet: {
        width: "25%",
    },

    smallWrapperDesktop: {
        width: "16.666%",
    },
});