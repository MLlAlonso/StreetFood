
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions, } from "react-native";

import { useRouter } from "expo-router";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { useBusiness } from "../hooks/useBusiness";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";
import Button from "@/components/ui/Button";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import OwnerBusinessCard from "../components/OwnerBusinessCard";

const MAX_CONTENT_WIDTH = 1440;
const DESKTOP_BREAKPOINT = 1024;
const TABLET_BREAKPOINT = 768;
const GRID_GAP = spacing.lg;

export default function BusinessListScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const { business, loading, remove, reload, } = useBusiness();
    const isDesktop = width >= DESKTOP_BREAKPOINT;
    const isTablet = width >= TABLET_BREAKPOINT && !isDesktop;
    const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;
    const horizontalPadding = isDesktop ? 40 : isTablet ? 28 : 20;
    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH,);
    const cardWidth = (contentWidth - horizontalPadding * 2 - GRID_GAP * (numColumns - 1)) / numColumns;

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.secondary} />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <AppHeader />

            <View style={styles.wrapper}>
                <View
                    style={[
                        styles.container,
                        {
                            width: contentWidth,
                            paddingHorizontal: horizontalPadding,
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {t("myBusinesses")}
                        </Text>

                        <Text style={styles.subtitle}>
                            {t("manageBusinessesDescription")}
                        </Text>
                    </View>

                    <FlatList
                        key={numColumns}
                        data={business}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={numColumns}
                        refreshing={loading}
                        onRefresh={reload}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>
                                    {t("noBusinessesYet")}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={[styles.cardContainer, numColumns > 1 ? { width: cardWidth } : styles.mobileCard,]}  >
                                <OwnerBusinessCard
                                    business={item}
                                    onEdit={() => router.push(`/my-business/edit/${item.id}`,)}
                                    onDelete={async () => { await remove(item.id); }}
                                />
                            </View>
                        )}
                    />

                    {business.length < 5 && (
                        <View style={styles.buttonContainer}>
                            <Button title={t("createBusiness")} onPress={() => router.push("/my-business/create") } />
                        </View>
                    )}
                </View>
            </View>

            <BottomTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    wrapper: {
        flex: 1,
        alignItems: "center",
        width: "100%",
    },

    container: {
        flex: 1,
        paddingTop: spacing.lg,
        alignSelf: "center",
        maxWidth: MAX_CONTENT_WIDTH,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },

    header: {
        marginBottom: spacing.lg,
    },

    title: {
        color: colors.title,
        fontSize: typography.size.xl,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    subtitle: {
        marginTop: spacing.xs,
        color: colors.text,
        fontSize: typography.size.md,
        lineHeight: 22,
    },

    list: {
        paddingBottom: spacing.lg,
        gap: GRID_GAP,
        flexGrow: 1,
    },

    columnWrapper: {
        gap: GRID_GAP,
        alignItems: "stretch",
    },

    cardContainer: {
        minWidth: 0,
    },

    mobileCard: {
        width: "100%",
    },

    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80,
    },

    emptyText: {
        color: colors.text,
        fontSize: typography.size.md,
        textAlign: "center",
    },

    buttonContainer: {
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
        maxWidth: 360,
        width: "100%",
        alignSelf: "center",
    },
});
