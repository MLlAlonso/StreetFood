import { View, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator, } from "react-native";

import { useEffect, useState, } from "react";
import { useLocalSearchParams, } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import { getBusiness, } from "../services/businessProfile.service";
import { BusinessProfile, } from "../types/BusinessProfile";
import MenuItemCard from "@/components/cards/MenuItemCard";

import { styles, } from "../styles/businessProfile.styles";

export default function BusinessProfileScreen() {
    const { id } = useLocalSearchParams();
    const [business, setBusiness] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const starIcon = require("@/assets/icons/star.png");
    const editIcon = require("@/assets/icons/pencil.png");
    const trashIcon = require("@/assets/icons/trash.png");
    const websiteIcon = require("@/assets/icons/website.png");
    const whatsappIcon = require("@/assets/icons/whatsapp.png");
    const instagramIcon = require("@/assets/icons/instagram.png");

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
                    Business not found
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

                    <View style={styles.heroOverlay} >
                        <Text style={styles.businessName} >
                            {business.business_name}
                        </Text>
                    </View>
                </View>

                {/* TYPE */}
                <Text style={styles.businessType} >
                    {
                        business.business_type === "food_truck" ? "Food Truck" : "Restaurant"
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
                                Rating
                            </Text>
                        </View>
                    </View>

                    {/* Distance */}
                    <View style={styles.statItem} >
                        <Text style={styles.statValue} > {business.distance} 
                        </Text>

                        <Text style={styles.statLabel} >
                            km away
                        </Text>
                    </View>

                    {/* Reviews */}
                    <View style={styles.statItem} >
                        <Text style={styles.statValue} >
                            0
                        </Text>

                        <Text style={styles.statLabel} >
                            reviews
                        </Text>
                    </View>
                </View>

                {/* EDIT */}
                <TouchableOpacity activeOpacity={0.9} style={styles.editButton} >
                    <Image source={editIcon} style={styles.editIcon} />

                    <Text style={styles.editText} >
                        Edit Profile
                    </Text>
                </TouchableOpacity>

                {/* DESCRIPTION */}
                {
                    business.description ? (
                        <>
                            <Text style={styles.sectionTitle} >
                                About
                            </Text>

                            <Text style={styles.description} >
                                {business.description}
                            </Text>
                        </>
                    ) : null
                }

                {/* MENU */}
                <Text style={styles.sectionTitle} >
                    Menu
                </Text>

                <View style={styles.menuContainer} >
                    {
                        business.menu.length === 0 && (
                            <Text style={styles.description} >
                                This business has not added any dishes yet.
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

                    <TouchableOpacity activeOpacity={0.8} style={[ styles.actionButton, styles.whatsappButton, ]} >
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