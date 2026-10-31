import { View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator, } from "react-native";

import { BusinessFormState } from "../types/BusinessFormState";
import { BusinessFormActions } from "../types/BusinessFormActions";
import { colors } from "@/styles/theme/colors";
import { styles } from "@/modules/auth/styles/register.styles";
import { FOOD_CATEGORIES } from "@/modules/auth/constants/foodCategories";
import Chip from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import SelectorCard from "@/components/ui/SelectorCard";
import MenuItemCard from "@/components/cards/MenuItemCard";
import MenuItemModal from "@/modules/auth/components/MenuItemModal";
import BusinessScheduleSection from "./BusinessScheduleSection";
import BusinessSocialLinksSection from "./BusinessSocialLinksSection";
import MapPickerModal from "@/components/maps/MapPickerModal";
import { useRouter } from "expo-router";
import { useTranslation } from "@/translations/hooks/useTranslation";
import { useEffect, useState } from "react";
import { reverseGeocodeLocation } from "../services/businessLocation.service";

interface Props {
    loading: boolean;
    state: BusinessFormState;
    actions: BusinessFormActions;
    submitLabel?: string;
    onSubmit: () => void;
    onBack?: () => void;
}

export default function BusinessForm({ loading, state, actions, submitLabel = "Save", onSubmit, onBack, }: Props) {
    const foodTruckIcon = require("@/assets/icons/foodtruck.png");
    const restaurantIcon = require("@/assets/icons/restaurant.png");
    const pencilIcon = require("@/assets/icons/pencil.png");
    const trashIcon = require("@/assets/icons/trash.png");
    const router = useRouter();
    const { t } = useTranslation();
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [locationAddress, setLocationAddress] = useState<string | null>(null);
    const [loadingAddress, setLoadingAddress] = useState(false);

    const handleCancel = () => {
        if (onBack) {
            onBack();
            return;
        }

        router.back();
    };

    const loadLocationAddress = async (latitude: number, longitude: number) => {
        setLoadingAddress(true);

        try {
            const address = await reverseGeocodeLocation(latitude, longitude);
            setLocationAddress(address);
        } catch (error) {
            console.warn("Could not retrieve business address:", error);
            setLocationAddress(null);
        } finally {
            setLoadingAddress(false);
        }
    };

    useEffect(() => {
        if (!state.location) {
            setLocationAddress(null);
            return;
        }

        loadLocationAddress(
            state.location.latitude,
            state.location.longitude
        );
    }, [state.location?.latitude, state.location?.longitude]);

    return (
        <>
            <View style={styles.row}>
                <SelectorCard icon={foodTruckIcon} title="Food Truck" active={state.businessType === "food_truck"} onPress={() => actions.setBusinessType("food_truck")} />
                <SelectorCard icon={restaurantIcon} title="Restaurant" active={state.businessType === "restaurant"} onPress={() => actions.setBusinessType("restaurant")} />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Business Name
                </Text>

                <Input
                    value={state.form.business_name}
                    onChangeText={(text) => actions.setForm({ ...state.form, business_name: text, })}
                    placeholder="Business name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Description
                </Text>

                <TextInput
                    multiline
                    value={state.form.description}
                    onChangeText={(text) => actions.setForm({ ...state.form, description: text, })}
                    placeholder="Describe your business"
                    placeholderTextColor="rgba(38,39,48,0.5)"
                    style={styles.textArea}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Logo
                </Text>

                {!state.logo ? (
                    <TouchableOpacity style={styles.inputButton} onPress={actions.handlePickLogo} >
                        <Text style={styles.inputButtonText}>
                            Upload Logo
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <Image source={{ uri: state.logo }} style={styles.logoPreview} />

                        <TouchableOpacity style={styles.removeLogoButton} onPress={() => actions.setLogo(null)} >
                            <Text style={styles.removeLogoText}>
                                Remove Logo
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View>
                <TouchableOpacity onPress={() => setShowLocationPicker(true)} style={styles.locationButton} >
                    <Text style={styles.locationButtonText}>
                        {state.location ? "Change location" : "Select location"}
                    </Text>
                </TouchableOpacity>

                {loadingAddress ? (
                    <Text style={styles.locationAddress}>
                        Getting address...
                    </Text>
                ) : locationAddress ? (
                    <Text style={styles.locationAddress}>
                        {locationAddress}
                    </Text>
                ) : state.location ? (
                    <Text style={styles.locationAddress}>
                        Address unavailable. You can still use these coordinates.
                    </Text>
                ) : (
                    <Text style={styles.locationAddress}>
                        No location selected
                    </Text>
                )}

                <MapPickerModal
                    visible={showLocationPicker}
                    initialLocation={state.location}
                    onClose={() => setShowLocationPicker(false)}
                    onSelect={(location) => { actions.setLocation(location); setShowLocationPicker(false); }}
                />
            </View>

            <BusinessScheduleSection enabled={state.scheduleEnabled} hours={state.hours} onToggleEnabled={actions.setScheduleEnabled} onHoursChange={actions.setHours} />

            <BusinessSocialLinksSection links={state.socialLinks ?? []} onChange={actions.setSocialLinks} />

            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Food Categories
                </Text>

                <Text style={{ marginBottom: 10, color: colors.textMuted, }} >
                    {state.categories.length}/3 selected
                </Text>

                <View style={styles.chipsContainer}>
                    {FOOD_CATEGORIES.map((category) => (
                        <Chip key={category} label={category} selected={state.categories.includes(category)} onPress={() => actions.toggleCategory(category)} />
                    ))}
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Menu
                </Text>

                {state.menuItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        image={item.image || ""}
                        title={item.name}
                        description={item.description}
                        editIcon={pencilIcon}
                        deleteIcon={trashIcon}
                        onEdit={() => { actions.setSelectedDish(item); actions.setShowMenuModal(true); }}
                        onDelete={() => actions.setMenuItems((prev) => prev.filter((x) => x.id !== item.id))}
                    />
                ))}

                <TouchableOpacity style={styles.menuButton} onPress={() => { actions.setSelectedDish(null); actions.setShowMenuModal(true); }} >
                    <View style={styles.plusCircle}>
                        <Text style={styles.plusText}>
                            +
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={loading} >
                    <Text style={styles.cancelButtonText}>
                        {t("cancel")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.primaryButton, styles.saveButton,]} onPress={onSubmit} disabled={loading} >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.primaryButtonText}>
                            {submitLabel}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <MenuItemModal
                visible={state.showMenuModal}
                dish={state.selectedDish}
                onClose={() => { actions.setShowMenuModal(false); actions.setSelectedDish(null); }}
                onSave={actions.handleAddDish}
                onUpdate={actions.handleUpdateDish}
            />
        </>
    );
}