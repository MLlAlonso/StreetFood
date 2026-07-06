import { View, ScrollView, StyleSheet, Text, ActivityIndicator, } from "react-native";

import { useState, useEffect, } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import SearchBar from "@/components/search/SearchBar";
import CategoryScroller from "@/components/categories/CategoryScroller";
import BusinessCardLarge from "@/components/cards/BusinessCardLarge";
import BusinessCardSmall from "@/components/cards/BusinessCardSmall";

import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { Business } from "@/modules/customer/types/Business";
import { getBusinesses } from "@/modules/customer/services/business.service";
import { useTranslation } from "@/translations/hooks/useTranslation";

interface Props { mode: "nearby" | "trending"; }
import { useLocalSearchParams, } from "expo-router";

export default function BusinessListScreen({ mode, }: Props) {
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [businesses, setBusinesses,] = useState<Business[]>([]);
    const [loading, setLoading,] = useState(true);

    const [selectedCategory, setSelectedCategory,] =
        useState(typeof params.category === "string" ? params.category : "");
    const { isTablet, isDesktop, } = useResponsive();

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        try {
            const data = await getBusinesses();
            setBusinesses(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBusinesses = businesses.filter(
        business => {
            const matchSearch = business.business_name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchCategory = !selectedCategory || business.categories.includes(selectedCategory);

            return (
                matchSearch && matchCategory
            );
        }
    );

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <SearchBar value={search} onChangeText={setSearch} />

                <CategoryScroller selected={selectedCategory} onSelect={setSelectedCategory} />
                {
                    loading && (
                        <ActivityIndicator size="large" color={colors.primary} />
                    )
                }

                {
                    !loading && filteredBusinesses.length > 0 && mode === "nearby" && (
                        <>
                            <Text style={styles.sectionTitle} >
                                {t("openNearby")}
                            </Text>

                            <View style={styles.largeGrid} >
                                {
                                    filteredBusinesses.map(
                                        business => (
                                            <View
                                                key={business.id}
                                                style={[
                                                    styles.largeWrapper,
                                                    isTablet && styles.largeWrapperTablet,
                                                    isDesktop && styles.largeWrapperDesktop,
                                                ]}
                                            >

                                                <BusinessCardLarge business={business} />
                                            </View>
                                        )
                                    )
                                }
                            </View>
                        </>
                    )
                }

                {
                    !loading && filteredBusinesses.length > 0 && mode === "trending" && (
                        <>
                            <Text style={styles.sectionTitle} >
                                {t("trending")}
                            </Text>

                            <View style={[styles.smallGrid, isTablet && styles.smallGridTablet, isDesktop && styles.smallGridDesktop,]} >
                                {
                                    filteredBusinesses.map(
                                        business => (
                                            <View
                                                key={business.id}
                                                style={[
                                                    styles.smallWrapper,
                                                    isTablet && styles.smallWrapperTablet,
                                                    isDesktop && styles.smallWrapperDesktop,
                                                ]}
                                            >

                                                <BusinessCardSmall
                                                    business={business} />
                                            </View>
                                        )
                                    )
                                }
                            </View>
                        </>
                    )
                }
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
        marginBottom: 12,
    },

    smallWrapperTablet: {
        width: "25%",
    },

    smallWrapperDesktop: {
        width: "16.666%",
    },
});