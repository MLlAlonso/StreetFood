import { ActivityIndicator, FlatList, StyleSheet, Text, View, } from "react-native";

import { useRouter } from "expo-router";
import { colors } from "@/styles/theme/colors";
import { useBusiness } from "../hooks/useBusiness";
import { useTranslation } from "@/translations/hooks/useTranslation";
import Button from "@/components/ui/Button";
import OwnerBusinessCard from "../components/OwnerBusinessCard";

export default function BusinessListScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { business, loading, remove, reload, } = useBusiness();

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={business}
                keyExtractor={(item) => item.id.toString()}
                refreshing={loading}
                onRefresh={reload}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text> {t("noBusinessesYet")} </Text>
                    </View>
                }

                renderItem={({ item }) => (
                    <OwnerBusinessCard
                        business={item}
                        onEdit={() => { router.push(`/business/edit/${item.id}`); }}
                        onDelete={async () => { await remove(item.id); }}
                    />
                )}
                contentContainerStyle={styles.list}
            />

            {
                business.length < 5 && (
                    <Button title={t("createBusiness")} onPress={() => { router.push("/business/create"); }} />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    list: {
        gap: 20,
        paddingBottom: 30,
    },

    empty: {
        alignItems: "center",
        marginTop: 80,
    },
});