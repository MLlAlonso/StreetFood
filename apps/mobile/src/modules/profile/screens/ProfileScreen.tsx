import { View, ScrollView, Text, Image, ActivityIndicator, TouchableOpacity, } from "react-native";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { colors } from "@/styles/theme/colors";
import { styles } from "../styles/profile.styles";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import Button from "@/components/ui/Button";
import AppHeader from "@/components/layout/AppHeader";
import AppModal from "@/components/ui/AppModal";
import EditProfileModal from "../components/EditProfileModal";
import ProfileOptionCard from "../components/ProfileOptionCard";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { useBusiness } from "../hooks/useBusiness";

export default function ProfileScreen() {
    const router = useRouter();
    const { authenticated, loading: authLoading, signOut, } = useAuth();
    const { profile, loading, saveProfile, } = useProfile();
    const [editVisible, setEditVisible,] = useState(false);
    const [saving, setSaving,] = useState(false);
    const [showLogoutModal, setShowLogoutModal,] = useState(false);
    const { t } = useTranslation();
    const { business,} = useBusiness();

    const handleSaveProfile = async (data: any) => {
        try {
            setSaving(true);
            await saveProfile(data);
            setEditVisible(false);
        } catch (error) {
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace("/welcome");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView contentContainerStyle={styles.content} >
                {
                    loading ?
                        <ActivityIndicator size="large" color={colors.secondary} />
                        :
                        profile && (
                            <>
                                <View style={styles.center}>
                                    <View style={styles.avatar}>
                                        {
                                            profile.avatar ?
                                                <Image source={{ uri: profile.avatar, }} style={styles.avatarImage} />
                                                :
                                                <Image
                                                    source={require("@/assets/icons/customer.png")}
                                                    resizeMode="contain"
                                                    style={{ width: 60, height: 60, opacity: .55, }}
                                                />
                                        }
                                    </View>

                                    <Text style={styles.name}>
                                        {profile.name}
                                    </Text>

                                    <Text style={styles.email}>
                                        {profile.email}
                                    </Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>
                                            {t("myProfile")}
                                        </Text>

                                        <TouchableOpacity onPress={() => setEditVisible(true)} >
                                            <Image
                                                source={require("@/assets/icons/edit.png")}
                                                resizeMode="contain"
                                                style={{ width: 26, height: 26, }}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>
                                            {t("name")}
                                        </Text>

                                        <Text style={styles.value}>
                                            {profile.name}
                                        </Text>
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>
                                            {t("email")}
                                        </Text>

                                        <Text style={styles.value}>
                                            {profile.email}
                                        </Text>
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>
                                            {t("phone")}
                                        </Text>

                                        <Text style={styles.value}>
                                            {profile.phone || "-"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.card}>
                                    <Text style={[ styles.cardTitle, { marginBottom: 12, }, ]} >
                                        My Business
                                    </Text>

                                    <Button
                                        title={ business.length === 0 ? "Create Business" : "My Businesses" }
                                        onPress={() => {
                                            router.push("/my-business");
                                        }}
                                    />
                                </View>

                                <View style={styles.card}>
                                    <Text style={[styles.cardTitle, { marginBottom: 12, },]} >
                                        {t("more")}
                                    </Text>

                                    <ProfileOptionCard
                                        title={t("settings")}
                                        icon={require("@/assets/icons/Settings.png")}
                                        onPress={() => { }}
                                    />

                                    <ProfileOptionCard
                                        title={t("help")}
                                        icon={require("@/assets/icons/Help.png")}
                                        onPress={() => { }}
                                    />

                                    <ProfileOptionCard
                                        title={t("privacy")}
                                        icon={require("@/assets/icons/Privacy.png")}
                                        onPress={() => { }}
                                    />

                                    <ProfileOptionCard
                                        title={t("aboutUs")}
                                        icon={require("@/assets/icons/foodtruck.png")}
                                        onPress={() => { }}
                                    />

                                    <View style={{ marginTop: 20, }} >
                                        <Button
                                            title={t("logout")}
                                            onPress={() => setShowLogoutModal(true)}
                                            backgroundColor="#E53935"
                                            textColor="#FFF"
                                        />
                                    </View>
                                </View>
                            </>
                        )
                }
            </ScrollView>

            <EditProfileModal
                visible={editVisible}
                profile={profile}
                loading={saving}
                onCancel={() => setEditVisible(false)}
                onSave={handleSaveProfile}
            />

            <AppModal
                visible={showLogoutModal}
                title={t("logoutConfirmation")}
                message={t("logoutMessage")}
                buttonText={t("logout")}
                onClose={async () => { setShowLogoutModal(false); await handleLogout(); }}
            />
        </View>
    );
}