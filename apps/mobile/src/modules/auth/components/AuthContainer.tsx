import { ReactNode } from "react";
import { View, StyleSheet, } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
interface Props { children: ReactNode;}

export default function AuthContainer({ children, }: Props) {
    const { isDesktop, isTablet, } = useResponsive();

    return (
        <View
            style={[
                styles.container,
                isTablet && styles.tablet,
                isDesktop && styles.desktop,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },

    tablet: {
        maxWidth: 800,
        alignSelf: "center",
    },

    desktop: {
        maxWidth: 1000,
        alignSelf: "center",
    },
});