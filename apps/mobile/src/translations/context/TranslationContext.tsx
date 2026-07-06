import { createContext, useMemo, useState, ReactNode, useEffect, } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api/api";
import en from "../locales/en";
import es from "../locales/es";
import { TranslationKeys } from "../types/TranslationKeys";

export type Language = "en" | "es";

interface TranslationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKeys) => string;
}

export const TranslationContext =
    createContext<TranslationContextType>({
        language: "en",
        setLanguage: () => { },
        t: (key) => key,
    });

interface Props { children: ReactNode; }
const STORAGE_KEY = "language";

export function TranslationProvider({ children }: Props) {
    const [language, setLanguageState] = useState<Language>("en");

    /**
     * Cargar idioma almacenado al iniciar la aplicación
     */
    useEffect(() => { loadLanguage(); }, []);

    useEffect(() => {
        console.log("Idioma actual:", language);
    }, [language]);

    const loadLanguage = async () => {
        try {
            /**
             * Primero intenta cargar el idioma guardado.
             */
            const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);

            if (savedLanguage === "en" || savedLanguage === "es") {
                setLanguageState(savedLanguage);
            }

            /**
             * Si existe un token, sincronizamos con el backend.
             */

            const token = await AsyncStorage.getItem("token");

            if (!token) {
                return;
            }

            const response = await api.get("/auth/me");
            const user = response.data.data;

            if (user.language === "en" || user.language === "es") {
                setLanguageState(user.language);
                await AsyncStorage.setItem(STORAGE_KEY, user.language);
                await AsyncStorage.setItem("user", JSON.stringify(user));
            }
        } catch (error) {
            console.log(
                "Error loading language",
                error
            );
        }
    };

    /**
     * Cambiar idioma y persistirlo
     */
    const setLanguage = async (newLanguage: Language) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, newLanguage);
            setLanguageState(newLanguage);
        } catch (error) {
            console.log("Error saving language", error);
        }
    };

    const translations = useMemo(
        () => (language === "es" ? es : en),
        [language]
    );

    const t = (key: TranslationKeys) => { return translations[key] ?? key; };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t, }} >
            {children}
        </TranslationContext.Provider>
    );
}