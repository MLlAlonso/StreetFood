import { useEffect } from "react";

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";
import { radius } from "@/styles/theme/radius";
import SelectorCard from "@/components/ui/SelectorCard";
import Input from "@/components/ui/Input";
import Chip from "@/components/ui/Chip";
import api from "@/services/api/api";

import { pickImage, uploadToCloudinary, } from "../services/cloudinary.service";

const FOOD_CATEGORIES = [
    "Pizza",
    "Burgers",
    "Desserts",
    "Coffee",
    "Hot Dogs",
    "Boneless",
    "Sushi",
    "SeaFood",
    "Japanese",
    "Italian",
    "Mexican",
    "Chinese",
];

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

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
    const customerIcon = require("@/assets/icons/customer.png");
    const vendorIcon = require("@/assets/icons/vendor.png");
    const foodTruckIcon = require("@/assets/icons/foodtruck.png");
    const restaurantIcon = require("@/assets/icons/restaurant.png");

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

    const toggleCategory = (category: string) => {
        if (categories.includes(category)) {
            setCategories(prev =>
                prev.filter(item => item !== category)
            );
        } else {
            setCategories(prev => [...prev, category]);
        }
    };

    const handlePickLogo = async () => {
        try {
            const image = await pickImage();
            if (!image) return;
            setLoading(true);
            const uploaded = await uploadToCloudinary(image);
            setLogo(uploaded);
            setLoading(false);
        } catch (error) {
            setLoading(false);

            Alert.alert(
                "Error",
                "Could not upload image"
            );
        }
    };

    const handleLocation = async () => {
        try {
            const permission =
                await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                Alert.alert(
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

            Alert.alert(
                "Success",
                "Location selected successfully"
            );
        } catch (error) {
            Alert.alert(
                "Error",
                "Could not get location"
            );
        }
    };

    const handleContinue = async () => {
        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password.trim()
        ) {
            Alert.alert(
                "Missing fields",
                "Please complete required fields"
            );

            return;
        }

        if (
            form.password !== form.repeatPassword
        ) {
            Alert.alert(
                "Error",
                "Passwords do not match"
            );

            return;
        }

        if (
            !PASSWORD_REGEX.test(form.password)
        ) {
            Alert.alert(
                "Invalid password",
                "Password must contain at least 8 characters, 1 uppercase letter and 1 number"
            );

            return;
        }

        // CUSTOMER
        if (role === "customer") {
            await handleRegister();
            return;
        }

        // VENDOR
        setStep(2);

        setTimeout(() => {
            console.log("STEP UPDATED");
        }, 100);
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

            const response = await api.post(
                "/auth/register",
                payload
            );

            Alert.alert(
                "Success",
                response.data.message
            );

            router.replace("/(tabs)/home");
        } catch (error: any) {
            console.log(
                "REGISTER ERROR:",
                error?.response?.data
            );

            Alert.alert(
                "Error",
                JSON.stringify(
                    error?.response?.data?.errors ??
                    error?.response?.data?.message
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Create Account
                </Text>

                <Text style={styles.headerSubtitle}>
                    Join and explore the best food near you
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                {step === 1 ? (
                    <>
                        <Text style={styles.label}>
                            I am
                        </Text>

                        <View style={styles.row}>
                            <SelectorCard
                                icon={customerIcon}
                                title="Customer"
                                subtitle="Find & explore food"
                                active={role === "customer"}
                                onPress={() =>
                                    setRole("customer")
                                }
                            />

                            <SelectorCard
                                icon={vendorIcon}
                                title="Vendor"
                                subtitle="List your business"
                                active={role === "vendor"}
                                onPress={() =>
                                    setRole("vendor")
                                }
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
                                value={
                                    form.repeatPassword
                                }
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

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={[ styles.languageButton, selectedLanguage === "en" && styles.languageButtonActive, ]}
                                    onPress={() =>
                                        setSelectedLanguage(
                                            "en"
                                        )
                                    }
                                >
                                    <Text style={[ styles.languageText, selectedLanguage === "en" && styles.languageTextActive, ]} >
                                        English
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[ styles.languageButton, selectedLanguage === "es" && styles.languageButtonActive, ]}
                                    onPress={() =>
                                        setSelectedLanguage(
                                            "es"
                                        )
                                    }
                                >
                                    <Text style={[ styles.languageText, selectedLanguage === "es" && styles.languageTextActive, ]} >
                                        Español
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleContinue}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text
                                    style={
                                        styles.primaryButtonText
                                    }
                                >
                                    {role ===
                                        "customer"
                                        ? "Create Account"
                                        : "Continue"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                router.push("/login")
                            }
                        >
                            <Text style={styles.footerText}>
                                Already have an
                                account?{" "}
                                <Text style={ styles.footerBold } >
                                    Log In
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            onPress={() =>
                                setStep(1)
                            }
                            style={styles.backButton}
                        >
                            <Text style={styles.backText}>
                                ← Back
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>
                            Description
                        </Text>

                        <View style={styles.row}>
                            <SelectorCard
                                icon={foodTruckIcon}
                                title="Food Truck"
                                active={
                                    businessType ===
                                    "food_truck"
                                }
                                onPress={() =>
                                    setBusinessType(
                                        "food_truck"
                                    )
                                }
                            />

                            <SelectorCard
                                icon={restaurantIcon}
                                title="Restaurant"
                                active={
                                    businessType ===
                                    "restaurant"
                                }
                                onPress={() =>
                                    setBusinessType(
                                        "restaurant"
                                    )
                                }
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>
                                Business Name
                            </Text>

                            <Input
                                value={
                                    form.business_name
                                }
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

                            <TouchableOpacity
                                style={
                                    styles.inputButton
                                }
                                onPress={
                                    handleLocation
                                }
                            >
                                <Text
                                    style={
                                        styles.inputButtonText
                                    }
                                >
                                    {location
                                        ? "Location selected"
                                        : "Select location"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup}>
                            <TouchableOpacity
                                style={
                                    styles.inputButton
                                }
                                onPress={
                                    handlePickLogo
                                }
                            >
                                <Text
                                    style={
                                        styles.inputButtonText
                                    }
                                >
                                    Upload Logo
                                </Text>
                            </TouchableOpacity>

                            {logo && (
                                <Image
                                    source={{
                                        uri: logo,
                                    }}
                                    style={
                                        styles.logoPreview
                                    }
                                />
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>
                                Food Categories
                            </Text>

                            <View
                                style={
                                    styles.chipsContainer
                                }
                            >
                                {FOOD_CATEGORIES.map(
                                    category => (
                                        <Chip
                                            key={
                                                category
                                            }
                                            label={
                                                category
                                            }
                                            selected={categories.includes(
                                                category
                                            )}
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
                                style={
                                    styles.menuButton
                                }
                            >
                                <View
                                    style={
                                        styles.plusCircle
                                    }
                                >
                                    <Text
                                        style={
                                            styles.plusText
                                        }
                                    >
                                        +
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleRegister}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text
                                    style={
                                        styles.primaryButtonText
                                    }
                                >
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingTop: 30,
        paddingBottom: 30,
    },

    headerTitle: {
        color: "#FFF",
        fontSize: typography.size.xxl,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    headerSubtitle: {
        marginTop: 8,
        color: "#FFF",
        opacity: 0.8,
        fontSize: typography.size.lg,
        fontFamily: typography.fontFamily.body,
    },

    content: {
        padding: spacing.lg,
        paddingBottom: 120,
    },

    row: {
        flexDirection: "row",
        gap: 15,
    },

    formGroup: {
        marginTop: 25,
    },

    label: {
        marginBottom: 10,
        color: colors.title,
        fontSize: 20,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    languageButton: {
        flex: 1,
        height: 60,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },

    languageButtonActive: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },

    languageText: {
        color: colors.textMuted,
        fontSize: typography.size.md,
    },

    languageTextActive: {
        color: "#FFF",
        fontWeight: "700",
    },

    primaryButton: {
        height: 58,
        borderRadius: 15,
        backgroundColor: colors.tertiary,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },

    primaryButtonText: {
        color: "#FFF",
        fontSize: typography.size.xl,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },

    footerText: {
        textAlign: "center",
        marginTop: 25,
        color: colors.textMuted,
        fontSize: typography.size.md,
    },

    footerBold: {
        color: colors.title,
        fontWeight: "700",
    },

    textArea: {
        minHeight: 140,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "rgba(38,39,48,0.2)",
        borderRadius: 15,
        padding: 16,
        textAlignVertical: "top",
        color: colors.text,
    },

    inputButton: {
        height: 58,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "rgba(38,39,48,0.2)",
        borderRadius: 15,
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    inputButtonText: {
        color: "rgba(38,39,48,0.5)",
    },

    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    menuButton: {
        height: 80,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(38,39,48,0.2)",
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },

    plusCircle: {
        width: 45,
        height: 45,
        borderRadius: 999,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    plusText: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "700",
    },

    logoPreview: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginTop: 16,
    },

    backButton: {
        marginBottom: 20,
    },

    backText: {
        color: colors.secondary,
        fontSize: typography.size.md,
        fontFamily: typography.fontFamily.title,
        fontWeight: typography.weight.bold as any,
    },
});