const I18n = (() => {
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
        try {
            const response = await fetch(`assets/lang/${language}.json`);

            if (!response.ok) {
                throw new Error(`Unable to load ${language}.json`);
            }

            translations = await response.json();
            currentLanguage = language;

            return true;
        } catch (error) {
            console.error("Translation error:", error);
            return false;
        }
    };

    const translatePage = () => {
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            const value = getNestedValue(translations, key);

            if (value !== undefined) {
                element.textContent = value;
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            const key = element.dataset.i18nPlaceholder;
            const value = getNestedValue(translations, key);

            if (value !== undefined) {
                element.placeholder = value;
            }
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const key = element.dataset.i18nAriaLabel;
            const value = getNestedValue(translations, key);

            if (value !== undefined) {
                element.setAttribute("aria-label", value);
            }
        });

        document.documentElement.lang = currentLanguage;

        document.querySelectorAll("[data-language]").forEach((button) => {
            const isActive = button.dataset.language === currentLanguage;

            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive.toString());
        });
    };

    const setLanguage = async (language) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            return;
        }

        const loaded = await loadTranslations(language);

        if (!loaded) {
            return;
        }

        localStorage.setItem("hferr-language", language);

        translatePage();
    };

    const init = async () => {
        const savedLanguage = localStorage.getItem("hferr-language");

        const language = SUPPORTED_LANGUAGES.includes(savedLanguage)
            ? savedLanguage
            : DEFAULT_LANGUAGE;

        document.querySelectorAll("[data-language]").forEach((button) => {
            button.addEventListener("click", () => {
                setLanguage(button.dataset.language);
            });
        });

        await setLanguage(language);
    };

    return {
        init
    };
})();