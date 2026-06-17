import { View, TextInput, Image, StyleSheet, } from "react-native";

import { useState } from "react";
import { colors } from "@/styles/theme/colors";
import { useResponsive } from "@/hooks/useResponsive";

interface Props {
    value?: string;
    onChangeText?: (text: string) => void;
}

export default function SearchBar({ value = "", onChangeText, }: Props) {
    const [focused, setFocused] = useState(false);
    const { isDesktop, isTablet, } = useResponsive();
    const searchIcon = require("@/assets/icons/search.png");

    return (
        <View
            style={[
                styles.wrapper,
                isTablet && styles.tabletWrapper,
                isDesktop && styles.desktopWrapper,
            ]}
        >
            <View
                style={[
                    styles.container,
                    focused && styles.containerFocused,
                ]}
            >
                <Image source={searchIcon} style={styles.icon} />

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Search food..."
                    placeholderTextColor="rgba(104,93,93,0.7)"
                    style={styles.input}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    underlineColorAndroid="transparent"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },

    tabletWrapper: {
        maxWidth: 700,
        alignSelf: "center",
    },

    desktopWrapper: {
        maxWidth: 900,
        alignSelf: "center",
    },

    container: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "rgba(104,93,93,0.5)",
        opacity: 0.7,
        paddingHorizontal: 16,
    },

    containerFocused: {
        opacity: 1,
        borderColor: "rgba(104,93,93,1)",
    },

    icon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 18,
        color: colors.text,
        outlineStyle: "none" as any,
    },
});