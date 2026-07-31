import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator,} from "react-native";

import { useState, useEffect,} from "react";
import Input from "@/components/ui/Input";
import { MenuItem } from "../types/MenuItem";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { pickImage, uploadToCloudinary,} from "../services/cloudinary.service";

interface Props {
    visible: boolean;
    onClose: () => void;
    dish?: MenuItem | null;

    onSave: (
        item: {
            name: string;
            description: string;
            image: string | null;
        }
    ) => void;

    onUpdate?: ( item: MenuItem ) => void;
}

export default function MenuItemModal({ visible, onClose, onSave, onUpdate, dish,}: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePickImage =
        async () => {
            try {
                const selected = await pickImage();

                if (!selected) {
                    return;
                }

                setLoading(true);
                const uploaded = await uploadToCloudinary( selected );
                setImage(uploaded);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        if (!visible) {
            return;
        }

        if (dish) {
            setName( dish.name );
            setDescription( dish.description );
            setImage( dish.image );
        } else {
            setName("");
            setDescription("");
            setImage(null);
        }
    }, [dish, visible]);

    const handleSave = () => {
        if (!name.trim()) {
            return;
        }

        if (dish && onUpdate) {
            onUpdate({ id: dish.id, name, description, image, });
        } else {
            onSave({name,description,image, });
        }

        setName("");
        setDescription("");
        setImage(null);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.formGroup}>
                        <Text style={styles.title}>
                            {
                                dish ? "Edit dish" : "Add a dish to the menu"
                            }
                        </Text>

                        <Input  value={name} onChangeText={setName} placeholder="Name of the dish" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>
                            Description
                        </Text>

                        <Input value={description} onChangeText={setDescription} placeholder="Describe the dish" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>
                            Dish Photo
                        </Text>

                        {!image && (
                            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage} >
                                <View style={styles.plusCircle}>
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.plusText}>
                                            +
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}

                        {image && (
                            <TouchableOpacity activeOpacity={0.9} onPress={() => setImage(null)} >
                                <Image source={{ uri: image, }} style={styles.previewImage} />

                                <Text style={styles.removeImageText}>
                                    Remove image
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose} >
                            <Text style={styles.cancelButtonText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.acceptButton} onPress={handleSave} >
                            <Text style={styles.acceptButtonText}>
                                { dish ? "Update" : "Accept" }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    modal: {
        width: "100%",
        maxWidth: 500,
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 24,
    },

    title: {
        color: colors.title,
        fontSize: 24,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
        marginBottom: 24,
    },

    formGroup: {
        marginBottom: 20,
    },

    label: {
        color: colors.title,
        fontSize: 16,
        fontWeight: typography.weight.bold as any,
        marginBottom: 8,
    },

    imageButton: {
        alignItems: "center",
        justifyContent: "center",
    },

    plusCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    plusText: {
        color: "#FFF",
        fontSize: 36,
        fontWeight: "700",
        marginTop: -2,
    },

    previewImage: {
        width: 300,
        height: 150,
        borderRadius: 12,
        marginTop: 16,
        alignSelf: "center",
    },

    removeImageText: {
        marginTop: 8,
        textAlign: "center",
        color: colors.danger,
        fontSize: 14,
        fontWeight: typography.weight.bold as any,
    },

    footer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },

    cancelButton: {
        flex: 1,
        height: 54,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
    },

    cancelButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: typography.weight.bold as any,
    },

    acceptButton: {
        flex: 1,
        height: 54,
        borderRadius: 15,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    acceptButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: typography.weight.bold as any,
    },
});