import { View, Image, TouchableOpacity, StyleSheet,} from "react-native";

import { useRouter } from "expo-router";
import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";

export default function AppHeader() {
    const router = useRouter();
    const { isDesktop, isTablet,} = useResponsive();
    const logo = require( "@/assets/logo/logo.png");

    return (
        <View
            style={[
                styles.container,
                isTablet && styles.tabletContainer,
                isDesktop && styles.desktopContainer,
            ]}
        >
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/main")}>
                <Image
                    source={logo}
                    resizeMode="contain"
                    style={[
                        styles.logo,
                        isTablet && styles.tabletLogo,
                        isDesktop && styles.desktopLogo,
                    ]}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },

    tabletContainer: {
        paddingVertical: 24,
    },

    desktopContainer: {
        paddingVertical: 28,
    },

    logo: {
        width: 220,
        height: 60,
    },

    tabletLogo: {
        width: 220,
        height: 70,
    },

    desktopLogo: {
        width: 260,
        height: 80,
    },
});