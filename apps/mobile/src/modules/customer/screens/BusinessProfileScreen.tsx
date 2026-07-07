import { View, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator, Alert, } from "react-native";

import { useEffect, useState, } from "react";
import { useLocalSearchParams, } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import MenuItemCard from "@/components/cards/MenuItemCard";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { BusinessProfile, } from "../types/BusinessProfile";
import { getBusiness, } from "../services/businessProfile.service";
import { useFavorite } from "../hooks/useFavorite";
import { styles, } from "../styles/businessProfile.styles";
import { useTranslation } from "@/translations/hooks/useTranslation";

export default function BusinessProfileScreen() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const { authenticated, } = useAuth();

    const {
        favorite,
        loading: favoriteLoading,
        toggleFavorite,
    } = useFavorite(Number(id));

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

    const [business, setBusiness] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const starIcon = require("@/assets/icons/star.png");
    const editIcon = require("@/assets/icons/pencil.png");
    const trashIcon = require("@/assets/icons/trash.png");
    const websiteIcon = require("@/assets/icons/website.png");
    const whatsappIcon = require("@/assets/icons/whatsapp.png");
    const instagramIcon = require("@/assets/icons/instagram.png");
    const heartOutlineIcon = require("@/assets/icons/heart-outline.png");
    const heartFilledIcon = require("@/assets/icons/heart-filled.png");

    useEffect(() => { loadBusiness(); }, []);

    const loadBusiness = async () => {
        try {
            const response = await getBusiness(Number(id));
            setBusiness(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
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
                    <View style={styles.statItem} >
                        <Text style={styles.statValue} >
                            {business.rating}
                        </Text>

                        <View style={styles.ratingRow} >
                            <Text style={styles.statLabel} >
                                {t("rating")}
                            </Text>
                        </View>
                    </View>

                    {/* Distance */}
                    <View style={styles.statItem} >
                        <Text style={styles.statValue} >
                            {business.distance}
                        </Text>

                        <Text style={styles.statLabel}>
                            {t("km")} {t("away")}
                        </Text>
                    </View>

                    {/* Reviews */}
                    <View style={styles.statItem} >
                        <Text style={styles.statValue} >
                            0
                        </Text>

                        <Text style={styles.statLabel} >
                            {t("reviews")}
                        </Text>
                    </View>
                </View>

                {/* EDIT */}
                <TouchableOpacity activeOpacity={0.9} style={styles.editButton} >
                    <Image source={editIcon} style={styles.editIcon} />

                    <Text style={styles.editText} >
                        {t("editProfile")}
                    </Text>
                </TouchableOpacity>

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
        </View>
    );
}