import { View, StyleSheet, Alert } from "react-native";

import { colors } from "@/styles/theme/colors";
import { Business } from "@/modules/customer/types/Business";
import { useTranslation } from "@/translations/hooks/useTranslation";
import Button from "@/components/ui/Button";
import BusinessCardLarge from "@/components/cards/BusinessCardLarge";

interface Props {
    business: Business;
    onEdit: () => void;
    onDelete: () => void;
}

export default function OwnerBusinessCard({ business, onEdit, onDelete,}: Props) {
    const { t } = useTranslation();

    function handleDelete() {
        Alert.alert(
            t("deleteBusiness"),
            t("deleteBusinessConfirmation"),
            [
                {
                    text: t("cancel"),
                    style: "cancel",
                },

                {
                    text: t("delete"),
                    style: "destructive",
                    onPress: onDelete,
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <BusinessCardLarge
                business={business}
            />

            <View style={styles.actions}>
                <Button title={t("edit")} onPress={onEdit} />
                <Button title={t("delete")} variant="danger" onPress={handleDelete} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
});