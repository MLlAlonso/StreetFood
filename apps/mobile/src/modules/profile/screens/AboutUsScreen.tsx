import { View, Text, ScrollView, } from "react-native";

import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { styles } from "../styles/aboutUs.styles";

export default function AboutUsScreen() {
    const { t } = useTranslation();
    const { isDesktop, isTablet } = useResponsive();

    const values = [
        {
            title: t("aboutUsDiscoveryTitle"),
            description: t("aboutUsDiscoveryDescription"),
        },
        {
            title: t("aboutUsCommunityTitle"),
            description: t("aboutUsCommunityDescription"),
        },
        {
            title: t("aboutUsGrowthTitle"),
            description: t("aboutUsGrowthDescription"),
        },
    ];

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, isTablet && styles.tabletContent, isDesktop && styles.desktopContent,]} >
                <View style={[styles.hero, isDesktop && styles.desktopHero,]}  >
                    <Text style={[styles.heroTitle, isDesktop && styles.desktopHeroTitle,]}  >
                        {t("aboutUsHeroTitle")}
                    </Text>

                    <Text style={styles.heroDescription}>
                        {t("aboutUsHeroDescription")}
                    </Text>
                </View>

                <View style={[ styles.introCard, isDesktop && styles.desktopIntroCard, ]} >
                    <Text style={styles.sectionTitle}>
                        {t("aboutUsWhatTitle")}
                    </Text>

                    <Text style={styles.description}>
                        {t("aboutUsWhatDescription")}
                    </Text>
                </View>

                <View style={[ styles.values, (isTablet || isDesktop) && styles.valuesGrid, isDesktop && styles.desktopValuesGrid,  ]} >
                    {values.map((item, index) => (
                        <View key={item.title} style={[ styles.valueCard, (isTablet || isDesktop) && styles.valueCardGrid,  isDesktop && styles.desktopValueCard, ]} >
                            <Text style={styles.valueNumber}>
                                {String(index + 1).padStart(2, "0")}
                            </Text>

                            <Text style={styles.valueTitle}>
                                {item.title}
                            </Text>

                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={[ styles.availabilityCard, isDesktop && styles.desktopAvailabilityCard, ]} >
                    <Text style={styles.sectionTitle}>
                        {t("aboutUsAvailabilityTitle")}
                    </Text>

                    <Text style={styles.description}>
                        {t("aboutUsAvailabilityDescription")}
                    </Text>

                    <View style={styles.platformList}>
                        <View style={styles.platformItem}>
                            <Text style={styles.platformName}>
                                {t("aboutUsPlatformWeb")}
                            </Text>
                        </View>

                        <View style={styles.platformItem}>
                            <Text style={styles.platformName}>
                                Android
                            </Text>
                        </View>

                        <View style={styles.platformItem}>
                            <Text style={styles.platformName}>
                                iOS
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[ styles.missionCard, isDesktop && styles.desktopMissionCard, ]} >
                    <Text style={styles.missionTitle}>
                        {t("aboutUsMissionTitle")}
                    </Text>

                    <Text style={styles.missionDescription}>
                        {t("aboutUsMissionDescription")}
                    </Text>
                </View>
            </ScrollView>

            <BottomTabs />
        </View>
    );
}