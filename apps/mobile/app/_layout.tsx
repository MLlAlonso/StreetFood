import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import { TranslationProvider } from "@/translations/context/TranslationContext";

export default function RootLayout() {
    const [loaded] = useFonts({
        Poppins: require("../src/assets/fonts/Poppins-Regular.ttf"),
        Inter: require("../src/assets/fonts/Inter_28pt-Regular.ttf"),
    });

    if (!loaded) {
        return null;
    }

    return (
        <TranslationProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </TranslationProvider>
    );
}