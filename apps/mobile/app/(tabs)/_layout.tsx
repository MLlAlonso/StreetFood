import { View, StyleSheet,} from "react-native";

import {Tabs, } from "expo-router";
import BottomTabs from "@/components/layout/BottomTabs";

export default function TabsLayout() {
    return (
        <View style={styles.container}>

            <View style={styles.content}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarStyle: { display: "none", },
                    }}
                >
                    <Tabs.Screen name="home"/>
                    <Tabs.Screen name="map"/>
                    <Tabs.Screen name="favorites"/>
                    <Tabs.Screen name="profile"/>
                    
                </Tabs>
            </View>

            <BottomTabs />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
    },
});