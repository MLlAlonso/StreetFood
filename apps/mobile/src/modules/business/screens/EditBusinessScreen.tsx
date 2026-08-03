import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import AppModal from "@/components/ui/AppModal";
import BottomTabs from "@/components/layout/BottomTabs";
import BusinessForm from "../components/BusinessForm";
import { styles } from "@/modules/auth/styles/register.styles";
import { MenuItem } from "@/modules/auth/types/MenuItem";
import { pickImage, uploadToCloudinary } from "@/modules/auth/services/cloudinary.service";
import * as Location from "expo-location";
import { useBusiness } from "@/modules/profile/hooks/useBusiness";
import { DEFAULT_BUSINESS_WEEK } from "../constants/businessWeek";

export default function EditBusinessScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { find, update } = useBusiness();
    const [loading, setLoading] = useState(true);
    const [businessType, setBusinessType] = useState<"food_truck" | "restaurant">("food_truck");
    const [logo, setLogo] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [location, setLocation] = useState<{ latitude: number; longitude: number; } | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [form, setForm] = useState({ business_name: "", description: "", });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [hours, setHours] = useState(DEFAULT_BUSINESS_WEEK);
    const [socialLinks, setSocialLinks] = useState([]);

    function openModal(title: string, message: string) {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    }

    useEffect(() => { loadBusiness(); }, []);

    async function loadBusiness() {
        try {
            setLoading(true);
            const data = await find(Number(id));
            console.log("Business Detail", data);
            setBusinessType(data.business_type);

            setForm({
                business_name: data.business_name,
                description: data.description ?? "",
            });

            setLogo(data.logo ?? null);
            setCategories(data.categories ?? []);
            setScheduleEnabled(data.schedule_enabled ?? false);
            setHours(data.hours?.length ? data.hours : DEFAULT_BUSINESS_WEEK);
            setSocialLinks(data.social_links ?? []);

            if (data.latitude && data.longitude) {
                setLocation({
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            }

            setMenuItems(data.menu ?? []);
        } catch (error) {
            console.log(error);
            openModal("Error", "Could not load business.");
        } finally {
            setLoading(false);
        }
    }

    function toggleCategory(category: string) {
        if (categories.includes(category)) {
            setCategories(prev => prev.filter(x => x !== category));
            return;
        }

        if (categories.length >= 3) {
            openModal("Limit reached", "You can select a maximum of 3 categories.");
            return;
        }

        setCategories(prev => [...prev, category]);
    }

    async function handlePickLogo() {
        const image = await pickImage();
        if (!image) return;
        setLoading(true);

        try {
            const uploaded = await uploadToCloudinary(image);
            setLogo(uploaded);
        } finally {
            setLoading(false);
        }
    }

    async function handleLocation() {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== "granted") {
            openModal("Permission denied", "Location permission is required.");
            return;
        }

        const current = await Location.getCurrentPositionAsync({});

        setLocation({
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
        });
    }

    function handleAddDish(item: Omit<MenuItem, "id">) {
        setMenuItems(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                ...item,
            },
        ]);
    }

    function handleUpdateDish(updated: MenuItem) {
        setMenuItems(prev =>
            prev.map(item =>
                item.id === updated.id
                    ? updated
                    : item
            )
        );

        setSelectedDish(null);
    }

    async function handleSubmit() {
        if (!form.business_name.trim()) {
            openModal("Missing information", "Business name is required.");
            return;
        }

        if (!logo) {
            openModal("Missing logo", "Upload your logo.");
            return;
        }

        if (!location) {
            openModal("Missing location", "Select your location.");
            return;
        }

        if (categories.length === 0) {
            openModal("Missing categories", "Select at least one category.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                business_type: businessType,
                business_name: form.business_name,
                description: form.description,
                logo,
                latitude: location.latitude,
                longitude: location.longitude,
                categories,
                schedule_enabled: scheduleEnabled,
                hours,

                menu: menuItems.map(item => ({
                    name: item.name,
                    description: item.description,
                    image: item.image,
                })),
            };

            console.log(payload);

            await update(Number(id), {
                business_type: businessType,
                business_name: form.business_name,
                description: form.description,
                logo,
                latitude: location.latitude,
                longitude: location.longitude,
                categories,
                schedule_enabled: scheduleEnabled,
                hours,
                social_links: socialLinks,

                menu: menuItems.map(item => ({
                    name: item.name,
                    description: item.description,
                    image: item.image,
                })),
            });

            if (router.canGoBack()) {
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace("/profile");
                }
            } else {
                router.replace("/profile");
            }

        } catch (error) {
            console.log(error);
            openModal("Error", "Could not update business.");
        } finally {
            setLoading(false);
        }
    }

    const state = {
        businessType,
        form,
        logo,
        categories,
        menuItems,
        location,
        selectedDish,
        showMenuModal,
        scheduleEnabled,
        hours,
        socialLinks,
    };

    const actions = {
        setBusinessType,

        setForm: (updatedForm: any) =>
            setForm(prev => ({
                ...prev,
                ...updatedForm,
            })),

        toggleCategory,
        handleLocation,
        handlePickLogo,
        setLogo,
        setShowMenuModal,
        setSelectedDish,
        handleAddDish,
        handleUpdateDish,
        setMenuItems,
        setScheduleEnabled,
        setHours,
        setSocialLinks,
    };

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} >
                <BusinessForm
                    loading={loading}
                    state={state}
                    actions={actions}
                    submitLabel="Save Changes"
                    onSubmit={handleSubmit}
                    onBack={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/profile");
                        }
                    }}
                />
            </ScrollView>

            <AppModal
                visible={modalVisible}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />

            <BottomTabs />
        </View>
    );
}