const I18n = (() => {
    const STORAGE_KEY = "wisconsign-language";
    const DEFAULT_LANGUAGE = "en";
    const SUPPORTED_LANGUAGES = ["en", "es"];
    let currentLanguage = DEFAULT_LANGUAGE;
    let translations = {};

    const getNestedValue = (object, path) => {
        return path.split(".").reduce((value, key) => {
            return value?.[key];
        }, object);
    };

    const loadTranslations = async (language) => {
        const response = await fetch(`assets/lang/${language}.json`, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(`Unable to load language file: ${language}`);
        }

        return response.json();
    };

    const updateTextContent = () => {
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            const value = getNestedValue(translations, key);

            if (value === undefined) {
                return;
            }

            element.textContent = value;
        });
    };

    const updatePlaceholders = () => {
        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            const key = element.dataset.i18nPlaceholder;
            const value = getNestedValue(translations, key);

            if (value === undefined) {
                return;
            }

            element.placeholder = value;
        });
    };

    const updateAttributes = () => {
        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const key = element.dataset.i18nAriaLabel;
            const value = getNestedValue(translations, key);

            if (value === undefined) {
                return;
            }

            element.setAttribute("aria-label", value);
        });

        document.querySelectorAll("[data-i18n-title]").forEach((element) => {
            const key = element.dataset.i18nTitle;
            const value = getNestedValue(translations, key);

            if (value === undefined) {
                return;
            }

            element.setAttribute("title", value);
        });
    };

    const updateLanguageButtons = () => {
        document.querySelectorAll(".navbar__language-button").forEach((button) => {
            const language = button.dataset.language;
            const isActive = language === currentLanguage;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    };

    const applyLanguage = async (language) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            language = DEFAULT_LANGUAGE;
        }

        try {
            translations = await loadTranslations(language);
            currentLanguage = language;
            document.documentElement.lang = language;
            updateTextContent();
            updatePlaceholders();
            updateAttributes();
            updateLanguageButtons();

            localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            console.error("Language loading error:", error);
        }
    };

    const init = async () => {
        const savedLanguage = localStorage.getItem(STORAGE_KEY);
        const initialLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;

        document.querySelectorAll(".navbar__language-button").forEach((button) => {
            button.addEventListener("click", () => {
                const language = button.dataset.language;

                if (language === currentLanguage) {
                    return;
                }

                applyLanguage(language);
            });
        });

        await applyLanguage(initialLanguage);
    };

    return {
        init,
        setLanguage: applyLanguage,
        getLanguage: () => currentLanguage
    };
})();