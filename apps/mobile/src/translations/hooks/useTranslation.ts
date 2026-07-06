import { useContext, } from "react";

import { TranslationContext, } from "../context/TranslationContext";

export function useTranslation() {
    return useContext(TranslationContext);
}