import { useEffect } from "react";

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Modal, } from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useResponsive } from "@/hooks/useResponsive";
import AppModal from "@/components/ui/AppModal";
import Input from "@/components/ui/Input";
import Chip from "@/components/ui/Chip";
import api from "@/services/api/api";
import SelectorCard from "@/components/ui/SelectorCard";
import AuthContainer from "../components/AuthContainer";
import { FOOD_CATEGORIES } from "../constants/foodCategories";
import { PASSWORD_REGEX, EMAIL_REGEX, } from "../constants/validation";
import { colors } from "@/styles/theme/colors";
import { styles } from "../styles/register.styles";
import MenuItemModal from "../components/MenuItemModal";
import MenuItemCard from "@/components/cards/MenuItemCard";
import { MenuItem } from "../types/MenuItem";
import { pickImage, uploadToCloudinary, } from "../services/cloudinary.service";
import EmailVerificationModal from "@/components/ui/EmailVerificationModal";
import BusinessForm from "@/modules/business/components/BusinessForm";

export default function RegisterScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"customer" | "vendor">("customer");
    const [step, setStep] = useState(1);

    useEffect(() => { console.log("CURRENT STEP:", step); }, [step]);

    const [businessType, setBusinessType] = useState<"food_truck" | "restaurant">("food_truck");
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">("en");
    const [categories, setCategories] = useState<string[]>([]);
    const [logo, setLogo] = useState<string | null>(null);
    const [showLogoModal, setShowLogoModal] = useState(false);
    const { isDesktop, isMobile, isTablet, } = useResponsive();
    const customerIcon = require("@/assets/icons/customer.png");
    const vendorIcon = require("@/assets/icons/vendor.png");
    const foodTruckIcon = require("@/assets/icons/foodtruck.png");
    const restaurantIcon = require("@/assets/icons/restaurant.png");
    const pencilIcon = require("@/assets/icons/pencil.png");
    const trashIcon = require("@/assets/icons/trash.png");
    const [showModal, setShowModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [sendingVerificationCode, setSendingVerificationCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [verifyingCode, setVerifyingCode] = useState(false);

    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        repeatPassword: "",
        business_name: "",
        description: "",
    });

    const openModal = (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    };

    const [showMenuModal, setShowMenuModal] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

    const toggleCategory = (category: string) => {
        if (categories.includes(category)) {
            setCategories(prev => prev.filter(item => item !== category));
            return;
        }

        if (categories.length >= 3) {
            openModal( "Limit reached", "You can select a maximum of 3 categories" );
            return;
        }

        setCategories(prev => [...prev, category,]);
    };

    const handlePickLogo = async () => {
        try {
            const image = await pickImage();
            if (!image) { return; }

            setLoading(true);
            const uploaded = await uploadToCloudinary(image);
            setLogo(uploaded);
        } catch (error: any) {
            openModal(
                "Error", error.message || "Could not upload image");
        } finally {
            setLoading(false);
        }
    };

    const handleLocation = async () => {
        try {
            const permission = await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                openModal("Permission denied", "Location permission is required");
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });

            openModal("Success", "Location selected successfully"
            );
        } catch (error) {
            openModal("Error", "Could not get location");
        }
    };

    const handleAddDish = (item: Omit<MenuItem, "id">) => {
        setMenuItems(
            prev => [
                ...prev,
                {
                    id: Date.now().toString(), ...item,
                },
            ]
        );
    };

    const handleUpdateDish = (updatedDish: MenuItem) => {
        setMenuItems(prev =>
            prev.map(item =>
                item.id === updatedDish.id
                    ? updatedDish
                    : item
            )
        );

        setSelectedDish(null);
    };

    const sendVerificationCode = async () => {
        try {
            setSendingVerificationCode(true);

            await api.post("/auth/send-verification-code", {
                email: form.email,
            });

            setShowVerificationModal(true);
        } catch {
            openModal( "Error", "Could not send verification code" );
        } finally {
            setSendingVerificationCode(false);
        }
    };

    const verifyCodeAndRegister = async () => {
        try {
            setVerifyingCode(true);

            await api.post("/auth/verify-code", {
                email: form.email,
                code: verificationCode,
            });

            setShowVerificationModal(false);
            await handleRegister();
        } catch {
            openModal("Error", "Invalid verification code");
        } finally {
            setVerifyingCode(false);
        }
    };

    const handleContinue = async () => {
        if ( !form.name.trim() || !form.email.trim() || !form.password.trim() ) {
            openModal("Missing fields", "Please complete required fields");
            return;
        }

        if (!EMAIL_REGEX.test(form.email.trim())) {
            openModal("Invalid email", "Please enter a valid email address");
            return;
        }

        if (form.password !== form.repeatPassword) {
            openModal("Error", "Passwords do not match");
            return;
        }

        if (!PASSWORD_REGEX.test(form.password)) {
            openModal( "Invalid password", "Password must contain at least 8 characters, 1 uppercase letter and 1 number" );
            return;
        }

        // CUSTOMER
        if (role === "customer") {
            await sendVerificationCode();
            return;
        }

        // VENDOR
        setStep(2);
        setTimeout(() => { console.log("STEP UPDATED"); }, 100);
    };

    const handleVendorSubmit = async () => {
        if (!form.business_name.trim()) {
            openModal("Missing information", "Business name is required");
            return;
        }

        if (!logo) {
            openModal("Missing logo", "Please upload your business logo");
            return;
        }

        if (!location) {
            openModal("Missing location", "Please select your business location");
            return;
        }

        if (categories.length === 0) {
            openModal("Missing categories", "Select at least one category");
            return;
        }
        await sendVerificationCode();
    };

    const handleRegister = async () => {
        try {
            setLoading(true);

            let payload: any = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                password_confirmation: form.repeatPassword,
                role,
                language: selectedLanguage,
            };

            payload = {
                ...payload,

                menu: menuItems.map(
                    item => ({
                        name: item.name,
                        description: item.description,
                        image: item.image,
                    })
                ),
            };

            if (role === "vendor") {
                payload = {
                    ...payload,
                    business_type: businessType,
                    business_name: form.business_name,
                    logo: logo || undefined,
                    description: form.description || undefined,
                    latitude: location?.latitude || undefined,
                    longitude: location?.longitude || undefined,

                    categories:
                        categories.length > 0
                            ? categories
                            : undefined,
                };
            }

            const response = await api.post("/auth/register", payload);
            openModal("Success", response.data.message);
            router.replace("/login");

        } catch (error: any) {
            console.log("FULL ERROR", error);
            console.log("RESPONSE", error?.response);
            console.log("DATA", error?.response?.data);

            openModal(
                "Error",
                JSON.stringify(
                    error?.response?.data ??
                    error?.message ??
                    error
                )
            );

        } finally {
            setLoading(false);
        }
    };

    const businessState = {
        businessType,
        form: {
            business_name: form.business_name,
            description: form.description,
        },
        location,
        logo,
        categories,
        menuItems,
        selectedDish,
        showMenuModal,
    };

    const businessActions = {
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
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, isDesktop && styles.desktopHeader,]} >
                <Text style={[styles.headerTitle, isDesktop && styles.desktopTextCenter,]} >
                    Create Account
                </Text>

                <Text style={[styles.headerSubtitle, isDesktop && styles.desktopTextCenter,]} >
                    Join and explore the best food near you
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <AuthContainer>
                    {step === 1 ? (
                        <>
                            <Text style={styles.label}>
                                I am
                            </Text>

                            <View style={[styles.row, !isMobile && styles.desktopRow,]} >
                                <SelectorCard
                                    icon={customerIcon}
                                    title="Customer"
                                    subtitle="Find & explore food"
                                    active={role === "customer"}
                                    onPress={() => setRole("customer")}
                                />

                                <SelectorCard
                                    icon={vendorIcon}
                                    title="Vendor"
                                    subtitle="List your business"
                                    active={role === "vendor"}
                                    onPress={() => setRole("vendor")}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Full Name*
                                </Text>

                                <Input
                                    value={form.name}
                                    onChangeText={text => setForm({ ...form, name: text, })}
                                    placeholder="Your name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Email*
                                </Text>

                                <Input
                                    value={form.email}
                                    onChangeText={text => setForm({ ...form, email: text, })}
                                    placeholder="example@email.com"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Phone Number
                                </Text>

                                <Input
                                    value={form.phone}
                                    onChangeText={text => setForm({ ...form, phone: text, })}
                                    placeholder="XXX XXX XXX XXXX"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Password*
                                </Text>

                                <Input
                                    value={form.password}
                                    onChangeText={text => setForm({ ...form, password: text, })}
                                    secureTextEntry
                                    placeholder="8 chars, 1 uppercase, 1 number"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Repeat password*
                                </Text>

                                <Input
                                    value={form.repeatPassword}
                                    onChangeText={text => setForm({ ...form, repeatPassword: text, })}
                                    secureTextEntry
                                    placeholder="8 chars, 1 uppercase, 1 number"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Select language
                                </Text>

                                <View style={[styles.row, !isMobile && styles.desktopRow,]} >
                                    <TouchableOpacity
                                        style={[styles.languageButton, selectedLanguage === "en" && styles.languageButtonActive,]}
                                        onPress={() => setSelectedLanguage("en")}
                                    >
                                        <Text style={[styles.languageText, selectedLanguage === "en" && styles.languageTextActive,]} >
                                            English
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.languageButton, selectedLanguage === "es" && styles.languageButtonActive,]}
                                        onPress={() => setSelectedLanguage("es")}
                                    >
                                        <Text style={[styles.languageText, selectedLanguage === "es" && styles.languageTextActive,]} >
                                            Español
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleContinue}
                                disabled={loading || sendingVerificationCode}
                            >
                                {(loading || sendingVerificationCode) ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.primaryButtonText}>
                                        {role === "customer"
                                            ? "Create Account"
                                            : "Continue"}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.push("/login")}  >
                                <Text style={styles.footerText}>
                                    Already have an
                                    account?{" "}
                                    <Text style={styles.footerBold} >
                                        Log In
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <BusinessForm
                            loading={loading || sendingVerificationCode}
                            state={businessState}
                            actions={businessActions}
                            onSubmit={handleVendorSubmit}
                            onBack={() => setStep(1)}
                            submitLabel="Create Account"
                        />
                    )}
                </AuthContainer>
            </ScrollView>

            <Modal visible={showLogoModal} transparent animationType="fade" >
                <View style={styles.modalOverlay} >
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowLogoModal(false)} >
                        <Text style={styles.closeButtonText} >
                            ✕
                        </Text>
                    </TouchableOpacity>

                    <Image source={{ uri: logo || "" }} style={styles.modalImage} resizeMode="contain" />
                </View>
            </Modal>

            <AppModal
                visible={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setShowModal(false)}
            />

            <EmailVerificationModal
                visible={showVerificationModal}
                code={verificationCode}
                setCode={setVerificationCode}
                loading={verifyingCode}
                onCancel={() => setShowVerificationModal(false)}
                onAccept={verifyCodeAndRegister}
            />
        </View>
    );
}