import { View, TouchableOpacity, Image, Text, StyleSheet, useWindowDimensions, } from "react-native";

import { useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import LoginRequiredModal from "@/modules/profile/components/LoginRequiredModal";

export default function BottomTabs() {
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();
    const { isDesktop } = useResponsive();
    const { authenticated, loading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        setShowLoginModal(false);
    }, [pathname]);

    const tabs = [
        {
            label: t("home"),
            route: "/main",
            path: "/main",
            icon: require("@/assets/icons/home.png"),
            requiresAuth: false,
        },

        {
            label: t("map"),
            route: "/(tabs)/map",
            path: "/map",
            icon: require("@/assets/icons/map.png"),
            requiresAuth: false,
        },

        {
            label: t("favorites"),
            route: "/(tabs)/favorites",
            path: "/favorites",
            icon: require("@/assets/icons/favorite.png"),
            requiresAuth: true,
        },

        {
            label: t("myAccount"),
            route: "/(tabs)/profile",
            path: "/profile",
            icon: require("@/assets/icons/profile.png"),
            requiresAuth: true,
        },
    ];

    const handlePress = (tab: (typeof tabs)[number]) => {
        if (loading) {
            return;
        }

        if (tab.requiresAuth && !authenticated) {
            setShowLoginModal(true);
            return;
        }

        if (pathname !== tab.path) {
            router.replace(tab.route);
        }
    };

    return (
        <>
            <View style={[styles.container, isDesktop && styles.desktopContainer,]} >
                {tabs.map((tab, index) => {
                    const active = pathname === tab.path;

                    return (
                        <TouchableOpacity
                            key={tab.route}
                            activeOpacity={0.9}
                            style={[
                                styles.tab,
                                index === tabs.length - 1 && {
                                    borderRightWidth: 0,
                                },
                                active && styles.activeTab,
                            ]}
                            onPress={() => handlePress(tab)}
                        >
                            <Image source={tab.icon} style={styles.icon} />

                            <Text style={[styles.label, active && styles.activeLabel,]} >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <LoginRequiredModal
                visible={showLoginModal}
                onCancel={() => setShowLoginModal(false)}
                onAccept={() => { setShowLoginModal(false); router.push("/register"); }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        backgroundColor: colors.primary,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.08)",
    },

    desktopContainer: {
        maxWidth: 900,
        alignSelf: "center",
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 10,
    },

    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "rgba(255,255,255,0.15)",
    },

    activeTab: {
        backgroundColor: colors.tertiaryHover,
        borderRightWidth: 2.5,
        borderRightColor: "#FFFFFF",
    },

    icon: {
        width: 25,
        height: 25,
        resizeMode: "contain",
        marginBottom: 4,
    },

    label: {
        color: "#FFFFFF",
        fontSize: 12,
        fontFamily: typography.fontFamily.body,
    },

    activeLabel: {
        fontWeight: "700",
    },
});