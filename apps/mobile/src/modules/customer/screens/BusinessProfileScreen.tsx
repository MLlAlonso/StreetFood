import { View, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator, Alert, } from "react-native";

import { useEffect, useState, } from "react";
import { useLocalSearchParams, } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import MenuItemCard from "@/components/cards/MenuItemCard";
import ReviewModal from "@/components/ui/ReviewModal";
import ReviewCard from "@/components/cards/ReviewCard"
import { useRouter } from "expo-router";;
import { Animated, } from "react-native";
import { useRef, } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { BusinessProfile, } from "../types/BusinessProfile";
import { createReview, } from "../services/review.service";
import { getBusiness, } from "../services/businessProfile.service";
import { useFavorite } from "../hooks/useFavorite";
import { styles, } from "../styles/businessProfile.styles";
import { useTranslation } from "@/translations/hooks/useTranslation";

export default function BusinessProfileScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const { authenticated, user, } = useAuth();

    const {
        favorite,
        loading: favoriteLoading,
        toggleFavorite,
    } = useFavorite(Number(id));

    const directionScale = useRef(new Animated.Value(1)).current;
    const rateScale = useRef(new Animated.Value(1)).current;

    const animateButton = (scale: Animated.Value, callback?: () => void,) => {
        Animated.sequence([
            Animated.timing(scale, { toValue: .95, duration: 70, useNativeDriver: true, }),
            Animated.timing(scale, { toValue: 1, duration: 70, useNativeDriver: true, }),
        ]).start(() => {
            callback?.();
        });
    };

    const handleFavorite = () => {
        if (!authenticated) {
            Alert.alert(
                t("loginRequired"),
                t("loginRequiredDescription")
            );
            return;
        }
        toggleFavorite();
    };

    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [displayRating, setDisplayRating] = useState(0);
    const [reviewVisible, setReviewVisible] = useState(false);
    const animatedRating = useRef(new Animated.Value(0)).current;
    const [business, setBusiness] = useState<BusinessProfile | null>(null);

    const starIcon = require("@/assets/icons/star.png");
    const editIcon = require("@/assets/icons/pencil.png");
    const trashIcon = require("@/assets/icons/trash.png");
    const websiteIcon = require("@/assets/icons/website.png");
    const whatsappIcon = require("@/assets/icons/whatsapp.png");
    const instagramIcon = require("@/assets/icons/instagram.png");
    const heartOutlineIcon = require("@/assets/icons/heart-outline.png");
    const heartFilledIcon = require("@/assets/icons/heart-filled.png");

    useEffect(() => { loadBusiness(); }, []);
    useEffect(() => {
        const listener = animatedRating.addListener(({ value }) => {
            setDisplayRating(Number(value.toFixed(1)));
        });

        return () => {
            animatedRating.removeListener(listener);
        };
    }, []);

    const handleCreateReview = async () => {
        if (rating === 0) {
            Alert.alert("Rating", "Please select a rating.");
            return;
        }

        if (!reviewText.trim()) {
            Alert.alert("Review", "Please write a review.");
            return;
        }

        try {
            await createReview(business.id, rating, reviewText);
            setReviewVisible(false);
            setReviewText("");
            setRating(0);
            await loadBusiness();
            Alert.alert(
                t("accept"),
                t("reviewSent")
            );
        }

        catch (error: any) {
            console.log(error.response?.data);

            Alert.alert(
                "Error",
                error.response?.data?.message ??
                "Unknown error"
            );
        }
    };

    const loadBusiness = async () => {
        try {
            const response = await getBusiness(Number(id));
            setBusiness(response);
            Animated.timing(animatedRating, {
                toValue: response.rating,
                duration: 800,
                useNativeDriver: false,
            }).start();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }} >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!business) {
        return (
            <View style={styles.loaderContainer}>
                <Text>
                    {t("businessNotFound")}
                </Text>
            </View>
        );
    }

    const isOwner = authenticated && user?.id === business.owner.id;

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >

                {/* HERO */}
                <View style={styles.hero}>
                    <Image source={{ uri: business.logo, }} style={styles.heroImage} />

                    <View style={styles.heroOverlay}>
                        <Text style={styles.businessName}>
                            {business.business_name}
                        </Text>

                        {
                            authenticated && !favoriteLoading && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.favoriteButton, !authenticated && { opacity: 0.6, },]}
                                    onPress={handleFavorite}
                                >

                                    <Image source={favorite ? heartFilledIcon : heartOutlineIcon} style={styles.favoriteIcon} />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>

                {/* TYPE */}
                <Text style={styles.businessType} >
                    {
                        business.business_type === "food_truck" ? t("foodTruck") : t("restaurant")
                    }
                </Text>

                {/* STATS */}
                <View style={styles.statsCard} >
                    {/* Rating */}
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {displayRating.toFixed(1)}
                        </Text>

                        <View style={styles.ratingRow}>
                            <Image source={starIcon} style={{ width: 16, height: 16, tintColor: "#FFD54A", marginRight: 4, }} />

                            <Text style={styles.statLabel}>
                                {t("rating")}
                            </Text>
                        </View>
                    </View>

                    {/* Distance */}
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {business.distance}
                        </Text>

                        <Text style={styles.statLabel}>
                            {t("km")} {t("away")}
                        </Text>
                    </View>

                    {/* Reviews */}
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {business.reviews_count}
                        </Text>

                        <Text style={styles.statLabel}>
                            {t("reviews")}
                        </Text>
                    </View>
                </View>

                {/* OWNER / VISITOR ACTIONS */}
                {
                    isOwner ? (
                        <TouchableOpacity activeOpacity={0.9} style={styles.editButton} >
                            <Image source={editIcon} style={styles.editIcon} />

                            <Text style={styles.editText}>
                                {t("editProfile")}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <Animated.View style={styles.profileButtonsRow}>
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
                                        Alert.alert(
                                            t("loginRequired"),
                                            t("loginRequiredDescription")
                                        );
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
                    )
                }

                {/* DESCRIPTION */}
                {
                    business.description ? (
                        <>
                            <Text style={styles.sectionTitle} >
                                {t("about")}
                            </Text>

                            <Text style={styles.description} >
                                {business.description}
                            </Text>
                        </>
                    ) : null
                }

                {/* MENU */}
                <Text style={styles.sectionTitle} >
                    {t("menu")}
                </Text>

                <View style={styles.menuContainer} >
                    {
                        business.menu.length === 0 && (
                            <Text style={styles.description} >
                                {t("noMenuItems")}
                            </Text>
                        )
                    }

                    {
                        business.menu.map(
                            item => (
                                <MenuItemCard
                                    key={item.id}
                                    image={item.image}
                                    title={item.name}
                                    description={item.description}
                                    showActions={false}
                                    editIcon={editIcon}
                                    deleteIcon={trashIcon}
                                />
                            )
                        )
                    }
                </View>

                <Text style={styles.sectionTitle}>
                    {t("reviews")}
                </Text>

                {
                    business.reviews.slice(0, 3).map(review => (
                        <ReviewCard
                            key={review.id}
                            name={review.user.name}
                            avatar={review.user.avatar}
                            comment={review.comment}
                            rating={review.rating}
                            createdAt={review.created_at}
                        />
                    ))
                }

                {
                    business.reviews_count > 3 && (
                        <TouchableOpacity onPress={() => router.push(`/business/${business.id}/reviews`)} >
                            <Text style={styles.seeMoreReviews}>
                                {t("showMore")}
                            </Text>
                        </TouchableOpacity>
                    )
                }

                {/* ACTIONS */}
                <View style={styles.actionsContainer} >
                    <TouchableOpacity activeOpacity={0.8} style={styles.actionButton} >
                        <Image source={websiteIcon} style={styles.actionIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={[styles.actionButton, styles.whatsappButton,]} >
                        <Image source={whatsappIcon} style={styles.actionIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} style={styles.actionButton} >
                        <Image source={instagramIcon} style={styles.actionIcon} />
                    </TouchableOpacity>
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