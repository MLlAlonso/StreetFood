import { View, TouchableOpacity, Image, Text, StyleSheet,} from "react-native";

import { useRouter, usePathname } from "expo-router";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useResponsive } from "@/hooks/useResponsive";

export default function BottomTabs() {
    const router = useRouter();
    const pathname = usePathname();
    const { isDesktop,} = useResponsive();

    const tabs = [
        {
            label: "Home",
            route: "/main",
            icon: require( "@/assets/icons/home.png" ),
        },

        {
            label: "Map",
            route: "/(tabs)/map",
            icon: require( "@/assets/icons/map.png" ),
        },

        {
            label: "Favorites",
            route: "/(tabs)/favorites",
            icon: require( "@/assets/icons/favorite.png" ),
        },

        {
            label: "My Account",
            route: "/(tabs)/profile",
            icon: require( "@/assets/icons/profile.png" ),
        },
    ];

    return (
        <View
            style={[
                styles.container,
                isDesktop && styles.desktopContainer,
            ]}
        >
            {
                tabs.map((tab, index) => {
                    const active = pathname === tab.route;

                    return (
                        <TouchableOpacity
                            key={tab.route}
                            activeOpacity={0.9}
                            style={[
                                styles.tab,
                                index === tabs.length - 1 && { borderRightWidth: 0,},
                                active && styles.activeTab,
                            ]}
                            onPress={() => router.replace( tab.route )}
                        >
                            <Image source={ tab.icon} style={ styles.icon} />

                            <Text
                                style={[
                                    styles.label,
                                    active && styles.activeLabel,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
        </View>
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