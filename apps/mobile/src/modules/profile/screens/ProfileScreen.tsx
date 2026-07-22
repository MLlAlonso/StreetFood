import { View, ScrollView, Text, Image, ActivityIndicator, TouchableOpacity, } from "react-native";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { colors } from "@/styles/theme/colors";
import { styles } from "../styles/profile.styles";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import EditProfileModal from "../components/EditProfileModal";
import ProfileOptionCard from "../components/ProfileOptionCard";
import LoginRequiredModal from "../components/LoginRequiredModal";

export default function ProfileScreen() {
    const router = useRouter();
    const { authenticated, loading: authLoading } = useAuth();
    const { profile, loading, saveProfile, } = useProfile();
    const [editVisible, setEditVisible,] = useState(false);
    const [saving, setSaving,] = useState(false);
    const [showLoginModal, setShowLoginModal,] = useState(false);

    useEffect(() => {
        if (!authLoading && !authenticated) {
            setShowLoginModal(true);
        }
    }, [authLoading, authenticated,]
    );

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
                                            My Account
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
                                            Name
                                        </Text>

                                        <Text style={styles.value}>
                                            {profile.name}
                                        </Text>
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>
                                            Email
                                        </Text>

                                        <Text style={styles.value}>
                                            {profile.email}
                                        </Text>
                                    </View>

                                    <View style={styles.field}>
                                        <Text style={styles.label}>
                                            Phone
                                        </Text>

                                        <Text style={styles.value}>
                                            {profile.phone || "-"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.card}>
                                    <Text style={[styles.cardTitle, { marginBottom: 12, },]} >
                                        More
                                    </Text>

                                    <ProfileOptionCard
                                        title="Settings"
                                        icon={require("@/assets/icons/Settings.png")}
                                        onPress={() => { }}
                                    />

                                    <ProfileOptionCard
                                        title="Help"
                                        icon={require("@/assets/icons/Help.png")}
                                        onPress={() => { }}
                                    />

                                    <ProfileOptionCard
                                        title="Privacy"
                                        icon={require("@/assets/icons/Privacy.png")}
                                        onPress={() => { }}
                                    />

                                    <ProfileOptionCard
                                        title="About us"
                                        icon={require("@/assets/icons/foodtruck.png")}
                                        onPress={() => { }}
                                    />
                                </View>
                            </>
                        )
                }
            </ScrollView>

            <LoginRequiredModal
                visible={showLoginModal}
                onCancel={() => setShowLoginModal(false)}
                onAccept={() => { setShowLoginModal(false); router.push("/register"); }}
            />

            <EditProfileModal
                visible={editVisible}
                profile={profile}
                loading={saving}
                onCancel={() => setEditVisible(false)}
                onSave={handleSaveProfile}
            />
        </View>
    );
}