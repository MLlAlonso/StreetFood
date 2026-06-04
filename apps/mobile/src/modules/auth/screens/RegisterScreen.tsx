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

import { pickImage, uploadToCloudinary, } from "../services/cloudinary.service";
import EmailVerificationModal from "@/components/ui/EmailVerificationModal";

export default function RegisterScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"customer" | "vendor">("customer");
    const [step, setStep] = useState(1);

    useEffect(() => {
        console.log("CURRENT STEP:", step);
    }, [step]);

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
    const [showModal, setShowModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

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

    const openModal = ( title: string, message: string ) => {
        setModalTitle(title);
        setModalMessage(message);
        setShowModal(true);
    };

    const toggleCategory = ( category: string) => {
        if ( categories.includes(category) ) {
            setCategories(prev =>
                prev.filter(
                    item => item !== category
                )
            );
            return;
        }

        if (categories.length >= 3) {
            openModal(
                "Limit reached",
                "You can select a maximum of 3 categories"
            );

            return;
        }

        setCategories(prev => [
            ...prev,
            category,
        ]);
    };

    const handlePickLogo = async () => {
        try {
            const image = await pickImage();

            if (!image) {
                return;
            }

            setLoading(true);
            const uploaded = await uploadToCloudinary(image);
            setLogo(uploaded);

        } catch (error: any) {
            openModal(
                "Error",
                error.message ||
                "Could not upload image"
            );

        } finally {
            setLoading(false);
        }
    };

    const handleLocation = async () => {
        try {
            const permission = await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                openModal(
                    "Permission denied",
                    "Location permission is required"
                );

                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });

            openModal(
                "Success",
                "Location selected successfully"
            );
        } catch (error) {
            openModal(
                "Error",
                "Could not get location"
            );
        }
    };

    const sendVerificationCode =
        async () => {
            try {
                await api.post(
                    "/auth/send-verification-code",
                    {
                        email: form.email,
                    }
                );

                setShowVerificationModal(
                    true
                );

            } catch {
                openModal(
                    "Error",
                    "Could not send verification code"
                );
            }
        };

    const handleContinue = async () => {
        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password.trim()
        ) {
            openModal(
                "Missing fields",
                "Please complete required fields"
            );

            return;
        }

        if ( !EMAIL_REGEX.test( form.email.trim() ) ) {
            openModal(
                "Invalid email",
                "Please enter a valid email address"
            );

            return;
        }

        if ( form.password !== form.repeatPassword ) {
            openModal(
                "Error",
                "Passwords do not match"
            );

            return;
        }

        if ( !PASSWORD_REGEX.test(form.password) ) {
            openModal(
                "Invalid password",
                "Password must contain at least 8 characters, 1 uppercase letter and 1 number"
            );

            return;
        }

        // CUSTOMER
        if (role === "customer") {
            await sendVerificationCode();
            return;
        }

        // VENDOR
        setStep(2);

        setTimeout(() => {
            console.log("STEP UPDATED");
        }, 100);
    };

    const verifyCodeAndRegister =
        async () => {
            try {
                await api.post(
                    "/auth/verify-code",
                    {
                        email: form.email,
                        code: verificationCode,
                    }
                );

                setShowVerificationModal( false );
                await handleRegister();

            } catch {
                openModal(
                    "Error",
                    "Invalid verification code"
                );
            }
        };

    const handleVendorSubmit =
        async () => {
            if ( !form.business_name.trim() ) {
                openModal(
                    "Missing information",
                    "Business name is required"
                );

                return;
            }

            if (!logo) {
                openModal(
                    "Missing logo",
                    "Please upload your business logo"
                );

                return;
            }

            if (!location) {
                openModal(
                    "Missing location",
                    "Please select your business location"
                );

                return;
            }

            if ( categories.length === 0 ) {
                openModal(
                    "Missing categories",
                    "Select at least one category"
                );

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

            const response =
                await api.post(
                    "/auth/register",
                    payload
                );

            openModal(
                "Success",
                response.data.message
            );

            router.replace("/(tabs)/home");

        } catch (error: any) {
            console.log( "FULL ERROR", error);
            console.log( "RESPONSE", error?.response);
            console.log( "DATA", error?.response?.data);

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

    return (
        <View style={styles.container}>
            <View style={[ styles.header, isDesktop && styles.desktopHeader, ]} >
                <Text style={[ styles.headerTitle, isDesktop && styles.desktopTextCenter, ]} >
                    Create Account
                </Text>

                <Text style={[ styles.headerSubtitle, isDesktop && styles.desktopTextCenter, ]} >
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

                            <View style={[ styles.row, !isMobile && styles.desktopRow, ]} >
                                <SelectorCard
                                    icon={customerIcon}
                                    title="Customer"
                                    subtitle="Find & explore food"
                                    active={role === "customer"}
                                    onPress={() => setRole("customer") }
                                />

                                <SelectorCard
                                    icon={vendorIcon}
                                    title="Vendor"
                                    subtitle="List your business"
                                    active={role === "vendor"}
                                    onPress={() => setRole("vendor") }
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Full Name*
                                </Text>

                                <Input
                                    value={form.name}
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            name: text,
                                        })
                                    }
                                    placeholder="Your name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Email*
                                </Text>

                                <Input
                                    value={form.email}
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            email: text,
                                        })
                                    }
                                    placeholder="example@email.com"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Phone Number
                                </Text>

                                <Input
                                    value={form.phone}
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            phone: text,
                                        })
                                    }
                                    placeholder="+52 999 999 9999"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Password*
                                </Text>

                                <Input
                                    value={form.password}
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            password: text,
                                        })
                                    }
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
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            repeatPassword:
                                                text,
                                        })
                                    }
                                    secureTextEntry
                                    placeholder="8 chars, 1 uppercase, 1 number"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Select language
                                </Text>

                                <View style={[ styles.row, !isMobile && styles.desktopRow, ]} >
                                    <TouchableOpacity
                                        style={[styles.languageButton, selectedLanguage === "en" && styles.languageButtonActive,]}
                                        onPress={() => setSelectedLanguage( "en" ) }
                                    >
                                        <Text style={[styles.languageText, selectedLanguage === "en" && styles.languageTextActive,]} >
                                            English
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.languageButton, selectedLanguage === "es" && styles.languageButtonActive,]}
                                        onPress={() => setSelectedLanguage( "es" ) }
                                    >
                                        <Text style={[styles.languageText, selectedLanguage === "es" && styles.languageTextActive,]} >
                                            Español
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue} >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text
                                        style={styles.primaryButtonText} >
                                        {role ===
                                            "customer"
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
                        <>
                            <TouchableOpacity
                                onPress={() => setStep(1)}
                                style={styles.backButton}
                            >
                                <Text style={styles.backText}>
                                    ← Back
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>
                                Description
                            </Text>

                            <View
                                style={[
                                    styles.row,
                                    !isMobile &&
                                    styles.desktopRow,
                                ]}
                            >
                                <SelectorCard
                                    icon={foodTruckIcon}
                                    title="Food Truck"
                                    active={businessType === "food_truck"}
                                    onPress={() => setBusinessType("food_truck")}
                                />

                                <SelectorCard
                                    icon={restaurantIcon}
                                    title="Restaurant"
                                    active={businessType === "restaurant"}
                                    onPress={() => setBusinessType("restaurant")}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Business Name
                                </Text>

                                <Input
                                    value={form.business_name}
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            business_name:
                                                text,
                                        })
                                    }
                                    placeholder="Business name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Description
                                </Text>

                                <TextInput
                                    multiline
                                    value={form.description}
                                    onChangeText={text =>
                                        setForm({
                                            ...form,
                                            description:
                                                text,
                                        })
                                    }
                                    placeholder="Describe your business"
                                    placeholderTextColor="rgba(38,39,48,0.5)"
                                    style={styles.textArea}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Location
                                </Text>

                                <TouchableOpacity style={styles.inputButton} onPress={handleLocation} >
                                    <Text style={styles.inputButtonText} >
                                        {location
                                            ? "Location selected"
                                            : "Select location"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Logo
                                </Text>

                                <TouchableOpacity style={styles.inputButton} onPress={handlePickLogo} >
                                    <Text style={styles.inputButtonText} >
                                        Upload Logo
                                    </Text>
                                </TouchableOpacity>

                                {logo && (
                                    <TouchableOpacity onPress={() => setShowLogoModal(true)} >
                                        <Image source={{ uri: logo }} style={styles.logoPreview} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Food Categories
                                </Text>

                                <Text style={{ marginBottom: 10, color: colors.textMuted, }} >
                                    {categories.length}/3 selected
                                </Text>

                                <View style={styles.chipsContainer} >
                                    {FOOD_CATEGORIES.map(
                                        category => (
                                            <Chip
                                                key={category}
                                                label={category}
                                                selected={categories.includes(category)}
                                                onPress={() =>
                                                    toggleCategory(
                                                        category
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>
                                    Menu
                                </Text>

                                <TouchableOpacity
                                    style={styles.menuButton} >
                                    <View style={styles.plusCircle} >
                                        <Text style={styles.plusText} >
                                            +
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleVendorSubmit}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.primaryButtonText} >
                                        Create Account
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>
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

                    <Image
                        source={{ uri: logo || "" }}
                        style={styles.modalImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>

            <AppModal
                visible={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setShowModal(false) }
            />

            <EmailVerificationModal
                visible={ showVerificationModal }
                code={verificationCode}
                setCode={setVerificationCode}
                onCancel={() => setShowVerificationModal( false ) }
                onAccept={ verifyCodeAndRegister }
            />
        </View>
    );
}