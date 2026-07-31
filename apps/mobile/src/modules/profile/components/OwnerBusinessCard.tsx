import { View, StyleSheet } from "react-native";

import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Business } from "@/modules/customer/types/Business";
import { useTranslation } from "@/translations/hooks/useTranslation";
import Button from "@/components/ui/Button";
import BusinessCardLarge from "@/components/cards/BusinessCardLarge";

interface Props {
    business: Business;
    onEdit: () => void;
    onDelete: () => void;
}

export default function OwnerBusinessCard({ business, onEdit, onDelete, }: Props) {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleDelete() {
        setShowDeleteModal(true);
    }

    return (
        <>
            <View style={styles.container}>
                <BusinessCardLarge business={business} />

                <View style={styles.actions}>
                    <View style={styles.button}>
                        <Button title={t("edit")} onPress={onEdit} />
                    </View>
                    <View style={styles.button}>
                        <Button title={t("delete")} onPress={handleDelete} />
                    </View>
                </View>

            </View>

            <ConfirmModal
                visible={showDeleteModal}
                title={t("deleteBusiness")}
                message={t("deleteBusinessConfirmation")}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() => { setShowDeleteModal(false); onDelete(); }}
            />
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 20,
    },

    button: {
        width: "40%",
    }
});