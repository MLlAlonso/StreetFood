import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions, } from "react-native";

import { useRouter } from "expo-router";
import { colors } from "@/styles/theme/colors";
import { useBusiness } from "../hooks/useBusiness";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";
import Button from "@/components/ui/Button";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import OwnerBusinessCard from "../components/OwnerBusinessCard";

export default function BusinessListScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const { business, loading, remove, reload, } = useBusiness();
    const contentWidth = width >= 1200 ? 900 : width >= 768 ? 700 : "100%";

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <AppHeader />

            <View style={styles.wrapper}>
                <View style={[styles.container, { width: contentWidth, },]} >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {t("myBusinesses")}
                        </Text>

                        <Text style={styles.subtitle}>
                            {t("manageBusinessesDescription")}
                        </Text>
                    </View>

                    <FlatList
                        data={business}
                        keyExtractor={(item) => item.id.toString()}
                        refreshing={loading}
                        onRefresh={reload}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>
                                    {t("noBusinessesYet")}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <OwnerBusinessCard
                                business={item}
                                onEdit={() => router.push(`/my-business/edit/${item.id}`)}
                                onDelete={async () => { await remove(item.id); }}
                            />
                        )}
                    />

                    {business.length < 5 && (
                        <View style={styles.buttonContainer}>
                            <Button
                                title={t("createBusiness")}
                                onPress={() => router.push("/my-business/create")}
                            />
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
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },

    header: {
        marginBottom: 20,
    },

    title: {
        color: colors.title,
        fontSize: 28,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    subtitle: {
        marginTop: 4,
        color: colors.text,
        fontSize: 16,
        lineHeight: 14,
    },

    list: {
        paddingBottom: 20,
        gap: 20,
        flexGrow: 1,
    },

    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80,
    },

    emptyText: {
        color: colors.text,
        fontSize: 16,
        textAlign: "center",
    },

    buttonContainer: {
        paddingTop: 10,
        paddingBottom: 20,
    },
});