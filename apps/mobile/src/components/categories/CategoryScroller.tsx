import { ScrollView, TouchableOpacity, Text, View, StyleSheet,} from "react-native";

import { useResponsive } from "@/hooks/useResponsive";
import { colors } from "@/styles/theme/colors";
import { FOOD_CATEGORIES, } from "@/modules/auth/constants/foodCategories";

interface Props {
    selected?: string;
    onSelect?: ( category: string ) => void;
}

export default function CategoryScroller({ selected, onSelect,}: Props) {
    const { isDesktop, } = useResponsive();

    if (isDesktop) {
        return (
            <View style={styles.desktopContainer}>
                {FOOD_CATEGORIES.map(
                    category => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.chip,
                                selected === category && styles.selectedChip,
                            ]}
                            onPress={() => onSelect?.( category ) }
                        >
                            <Text
                                style={[
                                    styles.text,
                                    selected === category && styles.selectedText,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        );
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={ false}
            contentContainerStyle={ styles.mobileContainer }
        >
            {FOOD_CATEGORIES.map(
                category => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.chip,
                            selected === category && styles.selectedChip,
                        ]}
                        onPress={() => onSelect?.( category) }
                    >
                        <Text
                            style={[
                                styles.text,
                                selected === category && styles.selectedText,
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                )
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mobileContainer: {
        paddingRight: 20,
        gap: 10,
    },

    desktopContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
        justifyContent: "center",
    },

    chip: {
        height: 42,
        paddingHorizontal: 18,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(104,93,93,0.5)",
        backgroundColor: "transparent",
    },

    selectedChip: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },

    text: {
        color: "#685D5D",
        fontSize: 14,
        fontWeight: "600",
    },

    selectedText: {
        color: colors.background,
        fontSize: 16,
    },
});