import { View, ScrollView, StyleSheet, Text, ActivityIndicator, } from "react-native";

import { useState, useEffect, } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/search/SearchBar";
import BottomTabs from "@/components/layout/BottomTabs";
import BusinessCardLarge from "@/components/cards/BusinessCardLarge";
import BusinessCardSmall from "@/components/cards/BusinessCardSmall";
import CategoryScroller from "@/components/categories/CategoryScroller";

import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { Business } from "@/modules/customer/types/Business";
import { getBusinesses } from "@/modules/customer/services/business.service";
import { TouchableOpacity, } from "react-native";
import { useRouter, } from "expo-router";

import { useTranslation } from "@/translations/hooks/useTranslation";

export default function MainScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory,] = useState("");
    const [businesses, setBusinesses,] = useState<Business[]>([]);
    const [loading, setLoading,] = useState(true);
    const { isTablet, isDesktop, } = useResponsive();

    useEffect(() => { loadBusinesses(); }, []);

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
            return (matchSearch && matchCategory);
        }
    );

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <SearchBar value={search} onChangeText={setSearch} />

                <CategoryScroller selected={selectedCategory} onSelect={setSelectedCategory} showMore />
                {
                    loading && (
                        <ActivityIndicator size="large" color={colors.primary} />
                    )
                }

                {
                    !loading && filteredBusinesses.length > 0 && (
                        <>
                            <View style={styles.sectionHeader} >
                                <Text style={styles.sectionTitle} >
                                    {t("openNearby")}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.push("/business/nearby")} >
                                    <Text style={styles.showMore} >
                                        {t("showMore")}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.largeGrid}>
                                {filteredBusinesses.map(
                                    business => (
                                        <View
                                            key={`large-${business.id}`}
                                            style={[
                                                styles.largeWrapper,
                                                isTablet && styles.largeWrapperTablet,
                                                isDesktop && styles.largeWrapperDesktop,
                                            ]}
                                        >
                                            <BusinessCardLarge business={business} />
                                        </View>
                                    )
                                )}
                            </View>
                        </>
                    )
                }

                {
                    !loading && filteredBusinesses.length > 0 && (
                        <>
                            <View style={styles.sectionHeader} >
                                <Text style={styles.sectionTitle} >
                                    {t("trending")}
                                </Text>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/business/trending")} >
                                    <Text style={styles.showMore} >
                                        {t("showMore")}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={[
                                    styles.smallGrid,
                                    isTablet && styles.smallGridTablet,
                                    isDesktop && styles.smallGridDesktop,
                                ]}
                            >
                                {
                                    filteredBusinesses.map(
                                        business => (
                                            <View
                                                key={`small-${business.id}`}
                                                style={[
                                                    styles.smallWrapper,
                                                    isTablet && styles.smallWrapperTablet,
                                                    isDesktop && styles.smallWrapperDesktop,
                                                ]}
                                            >
                                                <BusinessCardSmall business={business} />
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