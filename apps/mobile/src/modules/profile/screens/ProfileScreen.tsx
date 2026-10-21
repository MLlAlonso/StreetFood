import { View, ScrollView, Text, Image, ActivityIndicator, TouchableOpacity, } from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";
import { colors } from "@/styles/theme/colors";
import { styles } from "../styles/profile.styles";
import { useResponsive } from "@/hooks/useResponsive";
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
    const { signOut } = useAuth();
    const { profile, loading, saveProfile } = useProfile();
    const { business } = useBusiness();
    const { t } = useTranslation();
    const { isDesktop } = useResponsive();
    const [editVisible, setEditVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, isDesktop && styles.desktopContent,]} >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.secondary} />
                    </View>
                ) : (
                    profile && (
                        <View style={[styles.pageWrapper, isDesktop && styles.desktopPageWrapper,]} >

                            <View style={[styles.center, isDesktop && styles.desktopIdentity,]} >
                                <View
                                    style={[styles.avatar, isDesktop && styles.desktopAvatar,]} >
                                    {profile.avatar ? (
                                        <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
                                    ) : (
                                        <Image source={require("@/assets/icons/customer.png")} resizeMode="contain" style={{ width: 60, height: 60, opacity: 0.55, }} />
                                    )}
                                </View>

                                <View style={[styles.identityText, isDesktop && styles.desktopIdentityText,]} >
                                    <Text style={styles.name}>
                                        {profile.name}
                                    </Text>

                                    <Text style={styles.email}>
                                        {profile.email}
                                    </Text>
                                </View>
                            </View>

                            {/* Profile cards */}
                            <View style={[styles.cardsGrid, isDesktop && styles.desktopCardsGrid,]} >
                                {/* Personal information */}
                                <View style={[styles.card, isDesktop && styles.desktopCard,]} >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>
                                            {t("myProfile")}
                                        </Text>

                                        <TouchableOpacity onPress={() => setEditVisible(true)} accessibilityRole="button" accessibilityLabel={t("myProfile")} >
                                            <Image source={require("@/assets/icons/edit.png")} resizeMode="contain" style={{ width: 26, height: 26, }} />
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

                                {/* Business */}
                                <View style={[styles.card, isDesktop && styles.desktopCard]}>
                                    <Text style={[styles.cardTitle, styles.cardTitleSpacing]}>
                                        {t("myBusinesses")}
                                    </Text>

                                    {business.length === 0 ? (
                                        <View style={styles.businessEmpty}>
                                            <Text style={styles.businessEmptyText}>
                                                {t("noBusinessesYet")}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.businessList}>
                                            {business.map((item) => {
                                                const businessData = item as typeof item & {
                                                    business_name?: string;
                                                    business_type?: string;
                                                    type?: string;
                                                };

                                                const businessName = businessData.business_name ?? item.name;
                                                const businessType = businessData.business_type ?? businessData.type;
                                                const businessIcon = businessType === "restaurant" ? require("@/assets/icons/restaurant2.png") : require("@/assets/icons/foodtruck.png");

                                                return (
                                                    <TouchableOpacity
                                                        key={item.id}
                                                        style={styles.businessItem}
                                                        activeOpacity={0.75}
                                                        onPress={() => router.push(`/business/${item.id}` as any)}
                                                        accessibilityRole="button"
                                                        accessibilityLabel={businessName}
                                                    >
                                                        <View style={styles.businessIconContainer}>
                                                            <Image source={businessIcon} resizeMode="contain" style={styles.businessIcon} />
                                                        </View>

                                                        <Text style={styles.businessName} numberOfLines={2} >
                                                            {businessName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );

                                            })}
                                        </View>
                                    )}


                                    {business.length < 5 && (
                                        <View style={styles.businessCreateButton}>
                                            <Button
                                                title={
                                                    business.length === 0
                                                        ? t("createBusiness")
                                                        : t("myBusinesses")
                                                }
                                                onPress={() => {
                                                    if (business.length === 0) {
                                                        router.push("/my-business/create");
                                                    } else {
                                                        router.push("/my-business");
                                                    }
                                                }}
                                            />
                                        </View>
                                    )}

                                </View>

                                {/* Account options */}
                                <View style={[styles.card, isDesktop && styles.desktopCard,]} >
                                    <Text style={[styles.cardTitle, styles.cardTitleSpacing,]} >
                                        {t("more")}
                                    </Text>

                                    <View style={styles.optionsList}>
                                        <ProfileOptionCard title={t("help")} icon={require("@/assets/icons/Help.png")} onPress={() => router.push("/help")} />
                                        <ProfileOptionCard title={t("privacy")} icon={require("@/assets/icons/Privacy.png")} onPress={() => router.push("/privacy")} />
                                        <ProfileOptionCard title={t("aboutUs")} icon={require("@/assets/icons/foodtruck.png")} onPress={() => router.push("/about-us")} />
                                    </View>

                                    <View style={styles.logoutContainer}>
                                        <Button title={t("logout")} onPress={() => setShowLogoutModal(true)} backgroundColor="#E53935" textColor="#FFF" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                )}
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