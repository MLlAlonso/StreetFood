import { Modal, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, } from "react-native";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AppModal from "@/components/ui/AppModal";
import { Keyboard } from "react-native";
import { Profile } from "../types/Profile";
import { styles } from "../styles/profile.styles";
import { pickImage, uploadToCloudinary, } from "@/modules/auth/services/cloudinary.service";

interface Props {
    visible: boolean;
    profile: Profile | null;
    loading?: boolean;
    onCancel: () => void;
    onSave: (data: Partial<Profile>) => void;
}

export default function EditProfileModal({ visible, profile, loading = false, onCancel, onSave, }: Props) {
    const [name, setName,] = useState("");
    const [email, setEmail,] = useState("");
    const [phone, setPhone,] = useState("");
    const [modalTitle, setModalTitle,] = useState("");
    const [uploading, setUploading,] = useState(false);
    const [showModal, setShowModal,] = useState(false);
    const [modalMessage, setModalMessage,] = useState("");
    const [avatar, setAvatar,] = useState<string | null>(null);
    const [language, setLanguage,] = useState<"en" | "es">("en");

    useEffect(() => {
        if (!profile) {
            return;
        }

        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone ?? "");
        setLanguage(profile.language);
        setAvatar(profile.avatar ?? null);
    }, [profile, visible,]);

    const openModal = (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    };

    const handlePickAvatar = async () => {
        try {
            const image = await pickImage();

            if (!image) {
                return;
            }

            setUploading(true);
            const uploaded = await uploadToCloudinary(image);
            setAvatar(uploaded);
        } catch (error: any) {
            openModal(
                "Upload failed",
                error?.message ??
                "The image could not be uploaded."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        if (loading) {
            return;
        }

        if (!name.trim()) {
            openModal("Missing name", "Please enter your name.");
            return;
        }

        if (!email.trim()) {
            openModal("Missing email", "Please enter your email.");
            return;
        }

        Keyboard.dismiss();
        onSave({ name, email, phone, language, avatar: avatar || undefined, });
    };

    return (
        <Modal visible={visible} transparent animationType="fade" >
            <View style={styles.modalOverlay}>
                <View style={styles.editModal}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <Text style={styles.modalTitle}>
                            Edit profile
                        </Text>

                        <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.85} disabled={loading || uploading} onPress={handlePickAvatar} >
                            {
                                avatar ?
                                    <Image source={{ uri: avatar, }} style={styles.editAvatar} />
                                    :
                                    <Image source={require("@/assets/icons/customer.png")} style={styles.emptyAvatar} />
                            }

                        </TouchableOpacity>
                        {
                            uploading && (<ActivityIndicator />)
                        }

                        {
                            avatar && (
                                <TouchableOpacity disabled={loading || uploading} onPress={() => setAvatar(null)}>
                                    <Text style={styles.removeAvatar} >
                                        Remove photo
                                    </Text>
                                </TouchableOpacity>
                            )
                        }

                        <Text style={styles.inputLabel}>
                            Name
                        </Text>
                        <Input value={name} onChangeText={setName} placeholder="Your name" />

                        <Text style={styles.inputLabel}>
                            Email
                        </Text>
                        <Input value={email} onChangeText={setEmail} placeholder="Email" />

                        <Text style={styles.inputLabel}>
                            Phone
                        </Text>
                        <Input value={phone} onChangeText={setPhone} placeholder="Phone" />

                        <Text style={styles.inputLabel}>
                            Language
                        </Text>

                        <View style={styles.languageContainer} >
                            <TouchableOpacity
                                style={[styles.languageButton, language === "en" && styles.languageButtonActive,]}
                                onPress={() => setLanguage("en")}
                            >

                                <Text style={[styles.languageText, language === "en" && styles.languageTextActive,]} >
                                    English
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.languageButton, language === "es" && styles.languageButtonActive,]}
                                onPress={() => setLanguage("es")}
                            >

                                <Text style={[styles.languageText, language === "es" && styles.languageTextActive,]} >
                                    Español
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons} >
                            <Button
                                title={loading ? "Saving profile..." : "Save"}
                                onPress={() => {
                                    if (!loading) {
                                        handleSave();
                                    }
                                }}
                            />

                            <Button
                                title="Cancel"
                                backgroundColor="#FFF"
                                textColor="#222"
                                onPress={() => {
                                    if (!loading && !uploading) {
                                        onCancel();
                                    }
                                }}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>

            <AppModal visible={showModal} title={modalTitle} message={modalMessage} onClose={() => setShowModal(false)} />
        </Modal>
    );
}