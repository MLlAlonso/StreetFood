import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl, } from "react-native";

import { useEffect, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import BusinessCardSmall from "@/components/cards/BusinessCardSmall";
import SearchBar from "@/components/search/SearchBar";

import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";
import { Business } from "../types/Business";
import { getFavorites } from "../services/favorites.service";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function FavoritesScreen() {
    const { t } = useTranslation();
    const { isTablet, isDesktop, } = useResponsive();
    const [favorites, setFavorites,] = useState<Business[]>([]);
    const [search, setSearch,] = useState("");
    const [loading, setLoading,] = useState(true);
    const [refreshing, setRefreshing,] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const loadFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filtered = favorites.filter(
        business => business.business_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />

            <FlatList
                data={filtered}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); loadFavorites(); }}
                    />
                }

                contentContainerStyle={styles.content}

                ListHeaderComponent={
                    <>
                        <SearchBar value={search} onChangeText={setSearch} />

                        <Text style={styles.title}>
                            {t("favorites")}
                        </Text>
                    </>
                }

                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>
                            {t("noFavorites")}
                        </Text>

                        <Text style={styles.emptyText}>
                            {t("noFavoritesDescription")}
                        </Text>
                    </View>
                }

                numColumns={
                    isDesktop ? 6 : isTablet ? 4 : 2
                }

                columnWrapperStyle={
                    filtered.length > 1 ? styles.row : undefined
                }

                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.item,
                            isTablet && styles.itemTablet,
                            isDesktop && styles.itemDesktop,
                        ]}
                    >

                        <BusinessCardSmall business={item} />
                    </View>
                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    content: {
        padding: 20,
        paddingBottom: 120,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.primary,
        marginTop: 20,
        marginBottom: 20,
    },

    row: {
        justifyContent: "space-between",
    },

    item: {
        width: "48%",
        marginBottom: 16,
    },

    itemTablet: {
        width: "24%",
    },

    itemDesktop: {
        width: "16%",
    },

    empty: {
        marginTop: 80,
        alignItems: "center",
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.primary,
    },

    emptyText: {
        marginTop: 10,
        textAlign: "center",
        color: colors.textMuted,
        fontSize: 16,
        paddingHorizontal: 30,
    },
});