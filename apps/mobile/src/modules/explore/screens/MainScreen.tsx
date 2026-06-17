import { View, ScrollView, StyleSheet,} from "react-native";

import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SearchBar from "@/components/search/SearchBar";
import BottomTabs from "@/components/layout/BottomTabs";
import CategoryScroller from "@/components/categories/CategoryScroller";

import { colors } from "@/styles/theme/colors";

export default function MainScreen() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={ styles.content}
            >
                <SearchBar value={search} onChangeText={setSearch}/>

                <CategoryScroller selected={selectedCategory} onSelect={setSelectedCategory}/>
            </ScrollView>

            <BottomTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    content: {
        padding: 20,
        gap: 20,
        paddingBottom: 120,
    },
});