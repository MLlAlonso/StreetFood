import { View, Text, ScrollView,} from "react-native";

import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { styles } from "../styles/privacy.styles";

export default function PrivacyScreen() {
    const { t } = useTranslation();
    const { isDesktop, isTablet } = useResponsive();

    const sections = [
        {
            title: t("privacyTermsTitle"),
            description: t("privacyTermsDescription"),
        },
        {
            title: t("privacyInformationTitle"),
            description: t("privacyInformationDescription"),
        },
        {
            title: t("privacyUseTitle"),
            description: t("privacyUseDescription"),
        },
        {
            title: t("privacyLocationTitle"),
            description: t("privacyLocationDescription"),
        },
        {
            title: t("privacyReviewsTitle"),
            description: t("privacyReviewsDescription"),
        },
        {
            title: t("privacySecurityTitle"),
            description: t("privacySecurityDescription"),
        },
        {
            title: t("privacyResponsibilityTitle"),
            description: t("privacyResponsibilityDescription"),
        },
    ];

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[ styles.content, isTablet && styles.tabletContent, isDesktop && styles.desktopContent, ]} >
                <View style={styles.pageHeader}>
                    <Text style={styles.title}>
                        {t("privacyEyebrow")}
                    </Text>

                    <Text style={styles.subtitle}>
                        {t("privacyPageDescription")}
                    </Text>
                </View>

                <View style={[ styles.notice, isDesktop && styles.desktopNotice, ]} >
                    <View style={styles.noticeAccent} />

                    <View style={styles.noticeContent}>
                        <Text style={styles.noticeTitle}>
                            {t("privacyPromiseTitle")}
                        </Text>

                        <Text style={styles.noticeDescription}>
                            {t("privacyPromiseDescription")}
                        </Text>
                    </View>
                </View>

                <View style={[ styles.sections, (isTablet || isDesktop) && styles.sectionsGrid, ]} >
                    {sections.map((section, index) => (
                        <View key={section.title} style={[  styles.card, (isTablet || isDesktop) && styles.cardGrid, isDesktop && styles.desktopCard, ]}  >
                            <View style={styles.sectionNumberContainer}>
                                <Text style={styles.sectionNumber}>
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

                <View style={styles.footerContainer}>
                    <Text style={styles.footer}>
                        {t("privacyFooter")}
                    </Text>
                </View>
            </ScrollView>

            <BottomTabs />
        </View>
    );
}