
import { View, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator, Alert, Linking, Animated, } from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import MenuItemCard from "@/components/cards/MenuItemCard";
import ReviewModal from "@/components/ui/ReviewModal";
import ReviewCard from "@/components/cards/ReviewCard";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useBusiness } from "@/modules/profile/hooks/useBusiness";
import { useResponsive } from "@/hooks/useResponsive";
import { BusinessProfile } from "../types/BusinessProfile";
import { createReview } from "../services/review.service";
import { getBusiness } from "../services/businessProfile.service";
import { useFavorite } from "../hooks/useFavorite";
import { styles } from "../styles/businessProfile.styles";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { colors } from "@/styles/theme/colors";

export default function BusinessProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { t } = useTranslation();
    const { authenticated, user } = useAuth();
    const { updateStatus } = useBusiness();
    const { isDesktop } = useResponsive();

    const { favorite, loading: favoriteLoading, toggleFavorite, } = useFavorite(Number(id));
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [displayRating, setDisplayRating] = useState(0);
    const [reviewVisible, setReviewVisible] = useState(false);
    const [business, setBusiness] = useState<BusinessProfile | null>(null);
    const animatedRating = useRef(new Animated.Value(0)).current;
    const starIcon = require("@/assets/icons/star.png");
    const editIcon = require("@/assets/icons/pencil.png");
    const trashIcon = require("@/assets/icons/trash.png");
    const websiteIcon = require("@/assets/icons/website.png");
    const whatsappIcon = require("@/assets/icons/whatsapp.png");
    const instagramIcon = require("@/assets/icons/instagram.png");
    const facebookIcon = require("@/assets/icons/facebook.png");
    const uberEatsIcon = require("@/assets/icons/uber-eats.png");
    const rappiIcon = require("@/assets/icons/rappi.png");
    const didiFoodIcon = require("@/assets/icons/didi-food.png");
    const heartOutlineIcon = require("@/assets/icons/heart-outline.png");
    const heartFilledIcon = require("@/assets/icons/heart-filled.png");

    const SOCIAL_CONFIG: Record<
        BusinessProfile["social_links"][number]["type"],
        {
            icon: any;
            backgroundColor: string;
        }
    > = {
        website: {
            icon: websiteIcon,
            backgroundColor: "#262730",
        },
        whatsapp: {
            icon: whatsappIcon,
            backgroundColor: "#25D366",
        },
        instagram: {
            icon: instagramIcon,
            backgroundColor: "#C13584",
        },
        facebook: {
            icon: facebookIcon,
            backgroundColor: "#1877F2",
        },
        uber_eats: {
            icon: uberEatsIcon,
            backgroundColor: "#06C167",
        },
        rappi: {
            icon: rappiIcon,
            backgroundColor: "#FF4040",
        },
        didi_food: {
            icon: didiFoodIcon,
            backgroundColor: "#FF6A00",
        },
    };



    useEffect(() => {
        const listener = animatedRating.addListener(({ value }) => {
            setDisplayRating(Number(value.toFixed(1)));
        });

        return () => {
            animatedRating.removeListener(listener);
        };
    }, [animatedRating]);

    const loadBusiness = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await getBusiness(Number(id));
            setBusiness(response);
            animatedRating.setValue(0);

            Animated.timing(animatedRating, {
                toValue: response.rating,
                duration: 800,
                useNativeDriver: false,
            }).start();
        } catch (error) {
            console.error("Error loading business:", error);
            setBusiness(null);
        } finally {
            setLoading(false);
        }
    }, [id, animatedRating]);

    useFocusEffect(
        useCallback(() => {
            void loadBusiness();
        }, [loadBusiness])
    );

    const handleFavorite = () => {
        if (!authenticated) {
            Alert.alert(t("loginRequired"), t("loginRequiredDescription"));
            return;
        }

        toggleFavorite();
    };

    const openLink = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleStatus = async () => {
        if (!business) return;

        try {
            setLoading(true);
            await updateStatus(business.id, business.status === "open" ? "closed" : "open");
            await loadBusiness();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", t("businessStatusUpdateError"));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReview = async () => {
        if (rating === 0) {
            Alert.alert("Rating", "Please select a rating.");
            return;
        }

        if (!reviewText.trim()) {
            Alert.alert("Review", "Please write a review.");
            return;
        }

        if (!business) return;

        try {
            await createReview(business.id, rating, reviewText);
            setReviewVisible(false);
            setReviewText("");
            setRating(0);
            await loadBusiness();
            Alert.alert(t("accept"), t("reviewSent"));
        } catch (error: any) {
            console.log(error?.response?.data);
            Alert.alert("Error", error?.response?.data?.message ?? "Unknown error");
        }
    };

    if (loading && !business) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.secondary} />
            </View>
        );
    }

    if (!business) {
        return (
            <View style={styles.loaderContainer}>
                <Text>{t("businessNotFound")}</Text>
            </View>
        );
    }

    const isOwner = authenticated && user?.id === business.owner.id;
    const pageWidthStyle = isDesktop ? styles.desktopWrapper : styles.mobileWrapper;

    const descriptionSection = business.description ? (
        <View style={isDesktop ? styles.desktopSection : undefined}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop,]} >
                {t("about")}
            </Text>

            <Text style={[styles.description, isDesktop && styles.descriptionDesktop,]} >
                {business.description}
            </Text>
        </View>
    ) : null;

    const scheduleSection = (
        <View style={isDesktop ? styles.desktopSection : undefined}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop,]} >
                {t("businessHours")}
            </Text>

            <View style={[styles.scheduleCard, isDesktop && styles.scheduleCardDesktop,]}  >
                {business.hours.map((day) => (
                    <View key={day.day_of_week} style={styles.scheduleRow} >
                        <Text style={styles.scheduleDay}>
                            {[
                                t("sunday"),
                                t("monday"),
                                t("tuesday"),
                                t("wednesday"),
                                t("thursday"),
                                t("friday"),
                                t("saturday"),
                            ][day.day_of_week]}
                        </Text>

                        <Text style={styles.scheduleTime}>
                            {day.enabled
                                ? `${day.open_time?.substring(0, 5)} - ${day.close_time?.substring(0, 5)}`
                                : t("closed")}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const menuSection = (
        <View style={isDesktop ? styles.desktopSection : undefined}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop,]} >
                {t("menu")}
            </Text>

            <View style={[styles.menuContainer, isDesktop && styles.menuContainerDesktop,]} >
                {business.menu.length === 0 && (
                    <Text style={[styles.description, isDesktop && styles.descriptionDesktop,]} >
                        {t("noMenuItems")}
                    </Text>
                )}

                <View style={isDesktop ? styles.menuGridDesktop : undefined} >
                    {business.menu.map((item) => (
                        <View key={item.id} style={isDesktop ? styles.menuItemDesktop : undefined} >
                            <MenuItemCard
                                image={item.image}
                                title={item.name}
                                description={item.description}
                                showActions={false}
                                editIcon={editIcon}
                                deleteIcon={trashIcon}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const reviewsSection = (
        <View style={isDesktop ? styles.desktopSection : undefined}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop,]} >
                {t("reviews")}
            </Text>

            {business.reviews.slice(0, 3).map((review) => (
                <ReviewCard
                    key={review.id}
                    name={review.user.name}
                    avatar={review.user.avatar}
                    comment={review.comment}
                    rating={review.rating}
                    createdAt={review.created_at}
                />
            ))}

            {business.reviews_count > 3 && (
                <TouchableOpacity onPress={() => router.push(`/business/${business.id}/reviews`)} >
                    <Text style={styles.seeMoreReviews}>
                        {t("showMore")}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const socialSection = business.social_links.length > 0 ? (
        <View style={[styles.actionsContainer, isDesktop && styles.actionsContainerDesktop,]} >
            {business.social_links.map((link, index) => {
                const config = SOCIAL_CONFIG[link.type];
                if (!config) return null;

                return (
                    <TouchableOpacity
                        key={`${link.type}-${index}`}
                        activeOpacity={0.85}
                        style={[styles.actionButton, isDesktop && styles.actionButtonDesktop, { backgroundColor: config.backgroundColor, },]}
                        onPress={() => openLink(link.url)}
                    >
                        <Image source={config.icon} style={[styles.actionIcon, isDesktop && styles.actionIconDesktop,]} />
                    </TouchableOpacity>
                );
            })}
        </View>
    ) : null;

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop,]} >
                <View style={pageWidthStyle}>
                    {/* HERO */}
                    <View style={[styles.hero, isDesktop && styles.heroDesktop,]} >
                        <Image source={{ uri: business.logo }} style={[styles.heroImage, isDesktop && styles.heroImageDesktop,]} />

                        <View style={[styles.heroOverlay, isDesktop && styles.heroOverlayDesktop,]} >
                            <Text style={[styles.businessName, isDesktop && styles.businessNameDesktop,]} >
                                {business.business_name}
                            </Text>

                            <View style={[styles.statusBadge, business.status === "open" ? styles.statusOpen : styles.statusClosed,]} >
                                <Text style={styles.statusBadgeText}>
                                    {business.status === "open" ? t("open") : t("closed")}
                                </Text>
                            </View>

                            {authenticated && !favoriteLoading && (
                                <TouchableOpacity activeOpacity={0.8} style={styles.favoriteButton} onPress={handleFavorite} >
                                    <Image source={favorite ? heartFilledIcon : heartOutlineIcon} style={styles.favoriteIcon} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* BUSINESS TYPE */}
                    <Text style={[styles.businessType, isDesktop && styles.businessTypeDesktop,]} >
                        {business.business_type === "food_truck" ? t("foodTruck") : t("restaurant")}
                    </Text>

                    {/* STATS */}
                    <View style={[styles.statsCard, isDesktop && styles.statsDesktop,]} >
                        <View style={[styles.statItem, isDesktop && styles.statItemDesktop,]}  >
                            <Text style={styles.statValue}>
                                {displayRating.toFixed(1)}
                            </Text>

                            <View style={styles.ratingRow}>
                                <Image source={starIcon} style={{ width: 16, height: 16, tintColor: "#FFD54A", marginRight: 4, }} >
                                </Image>
                                <Text style={styles.statLabel}>
                                    {t("rating")}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.statItem, isDesktop && styles.statItemDesktop,]} >
                            <Text style={styles.statValue}>
                                {business.distance}
                            </Text>

                            <Text style={styles.statLabel}>
                                {t("km")} {t("away")}
                            </Text>
                        </View>

                        <View style={[styles.statItem, isDesktop && styles.statItemDesktop,]} >
                            <Text style={styles.statValue}>
                                {business.reviews_count}
                            </Text>

                            <Text style={styles.statLabel}>
                                {t("reviews")}
                            </Text>
                        </View>
                    </View>

                    {/* OWNER / VISITOR ACTIONS */}
                    {isOwner ? (
                        <View style={[styles.ownerActions, isDesktop && styles.ownerActionsDesktop,]} >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[styles.editButton, isDesktop && styles.editButtonDesktop,]}
                                onPress={() => router.push(`/my-business/edit/${business.id}`)}
                            >
                                <Image source={editIcon} style={styles.editIcon} />

                                <Text style={styles.editText}>
                                    {t("editProfile")}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleToggleStatus}
                                style={[styles.statusButton, isDesktop && styles.statusButtonDesktop, business.status === "open" ? styles.closeButton : styles.openButton,]}
                            >
                                <Text style={styles.statusButtonText}>
                                    {business.status === "open" ? t("closeTemporarily") : t("openNow")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Animated.View style={[styles.profileButtonsRow, isDesktop && styles.profileButtonsRowDesktop,]} >
                            <TouchableOpacity activeOpacity={0.85} style={styles.directionButton} >
                                <Image source={require("@/assets/icons/location.png")} style={styles.directionIcon} />

                                <Text style={styles.directionText}>
                                    {t("getDirections")}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={styles.rateButton}
                                onPress={() => {
                                    if (!authenticated) {
                                        Alert.alert(t("loginRequired"), t("loginRequiredDescription"));
                                        return;
                                    }

                                    setReviewVisible(true);
                                }}
                            >
                                <Image source={starIcon} style={styles.directionIcon} />

                                <Text style={styles.directionText}>
                                    {t("rate")}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* DETAILS */}
                    {isDesktop ? (
                        <View style={styles.desktopDetailsGrid}>
                            <View style={styles.desktopMainColumn}>
                                {descriptionSection}
                                {menuSection}
                                {reviewsSection}
                            </View>

                            <View style={styles.desktopSideColumn}>
                                {scheduleSection}
                                {socialSection}
                            </View>
                        </View>
                    ) : (
                        <>
                            {descriptionSection}
                            {scheduleSection}
                            {menuSection}
                            {reviewsSection}
                            {socialSection}
                        </>
                    )}
                </View>
            </ScrollView>

            <BottomTabs />

            <ReviewModal
                visible={reviewVisible}
                review={reviewText}
                rating={rating}
                onChangeReview={setReviewText}
                onChangeRating={setRating}
                onCancel={() => {
                    setReviewVisible(false);
                    setReviewText("");
                    setRating(0);
                }}
                onAccept={handleCreateReview}
            />
        </View>
    );
}
