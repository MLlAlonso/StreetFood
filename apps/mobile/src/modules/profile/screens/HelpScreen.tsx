import { View, Text, ScrollView, } from "react-native";

import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { styles } from "../styles/help.styles";

export default function HelpScreen() {
    const { t } = useTranslation();
    const { isDesktop, isTablet } = useResponsive();

    const sections = [
        {
            title: t("helpSearchTitle"),
            description: t("helpSearchDescription"),
        },
        {
            title: t("helpBusinessTitle"),
            description: t("helpBusinessDescription"),
        },
        {
            title: t("helpLocationTitle"),
            description: t("helpLocationDescription"),
        },
        {
            title: t("helpFavoritesTitle"),
            description: t("helpFavoritesDescription"),
        },
        {
            title: t("helpReviewsTitle"),
            description: t("helpReviewsDescription"),
        },
        {
            title: t("helpOwnersTitle"),
            description: t("helpOwnersDescription"),
        },
    ];

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, isTablet && styles.tabletContent, isDesktop && styles.desktopContent,]}  >
                <View style={styles.pageHeader}>
                    <Text style={styles.title}>
                        {t("helpPageTitle")}
                    </Text>

                    <Text style={styles.subtitle}>
                        {t("helpPageDescription")}
                    </Text>
                </View>

                <View style={[styles.sections, (isTablet || isDesktop) && styles.sectionsGrid,]} >
                    {sections.map((section, index) => (
                        <View key={section.title} style={[styles.card, (isTablet || isDesktop) && styles.cardGrid,]} >
                            <View style={styles.numberContainer}>
                                <Text style={styles.number}>
                                    {String(index + 1).padStart(2, "0")}
                                </Text>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>
                                    {section.title}
                                </Text>

                                <Text style={styles.cardDescription}>
                                    {section.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.footerCard}>
                    <Text style={styles.footerTitle}>
                        {t("helpNeedMoreTitle")}
                    </Text>

                    <Text style={styles.footerDescription}>
                        {t("helpNeedMoreDescription")}
                    </Text>

                    <Text style={styles.contactEmail}>
                        info@buskapp.co
                    </Text>
                </View>
            </ScrollView>

            <BottomTabs />
        </View>
    );
}