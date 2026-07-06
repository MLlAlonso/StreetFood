import { View, ScrollView, StyleSheet, Text, } from "react-native";

import { useRouter, } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import CategoryCard from "@/components/cards/CategoryCard";
import { FOOD_CATEGORIES, FoodCategory, } from "@/modules/auth/constants/foodCategories";

import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "@/translations/hooks/useTranslation";

export default function CategoriesScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { isTablet, isDesktop, } = useResponsive();

    const categoryImages = {
        Pizza: require("@/assets/categories/pizza.jpg"),
        Burgers: require("@/assets/categories/burgers.jpg"),
        Desserts: require("@/assets/categories/desserts.jpg"),
        Coffee: require("@/assets/categories/coffee.jpg"),
        "Hot Dogs": require("@/assets/categories/hotdogs.jpg"),
        Boneless: require("@/assets/categories/boneless.jpg"),
        Sushi: require("@/assets/categories/sushi.jpg"),
        SeaFood: require("@/assets/categories/seafood.jpg"),
        Japanese: require("@/assets/categories/japanese.jpg"),
        Italian: require("@/assets/categories/italian.jpg"),
        Mexican: require("@/assets/categories/mexican.jpg"),
        Chinese: require("@/assets/categories/chinese.jpg"),
    } as Record<string, any>;

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <Text style={styles.title}>
                    {t("categories")}
                </Text>

                <View style={[styles.grid, isTablet && styles.gridTablet, isDesktop && styles.gridDesktop,]} >
                    {
                        FOOD_CATEGORIES.map(
                            category => (
                                <View
                                    key={category}
                                    style={[styles.item, isTablet && styles.itemTablet, isDesktop && styles.itemDesktop,]}
                                >

                                    <CategoryCard
                                        category={t(category)}
                                        image={categoryImages[category]}
                                        onPress={() => router.push({ pathname: "/business/nearby", params: { category, }, })}
                                    />
                                </View>
                            )
                        )
                    }
                </View>
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
    },

    title: {
        color: colors.primary,
        fontSize: 30,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
        marginBottom: 20,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -8,
    },

    gridTablet: {
    },

    gridDesktop: {
    },

    item: {
        width: "50%",
        paddingHorizontal: 8,
        marginBottom: 16,
    },

    itemTablet: {
        width: "33.333%",
    },

    itemDesktop: {
        width: "25%",
    },
});