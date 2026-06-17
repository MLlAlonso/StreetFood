import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, } from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api/api";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import AppModal from "@/components/ui/AppModal";

import { useResponsive } from "@/hooks/useResponsive";
import { createStyles } from "../styles/login.styles";

export default function LoginScreen() {
    const router = useRouter();
    const { isDesktop, isTablet } = useResponsive();
    const styles = createStyles(isDesktop, isTablet);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const openModal = (title: string, message: string) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleLogin =
        async () => {
            try {
                setLoading(true);

                const payload = {
                    email: emailOrPhone,
                    password,
                };

                const response =
                    await api.post(
                        "/auth/login",
                        payload
                    );

                await AsyncStorage.setItem(
                    "token",
                    response.data.data.token
                );

                router.replace("/(tabs)/home");
            } catch (error: any) {
                openModal(
                    "Login Error",
                    error?.response?.data
                        ?.message ??
                    "Invalid credentials"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Image source={require("@/assets/logo/logo.png")} style={styles.logo} />
                        <View style={styles.headerContent}>
                            <Text style={styles.title}>
                                Welcome Back!
                            </Text>

                            <Text style={styles.subtitle} >
                                Log in to continue exploring
                            </Text>

                            {isDesktop && (
                                <TouchableOpacity
                                    style={{ marginTop: 40 }}
                                    onPress={() => router.replace("/(tabs)/home")}
                                >
                                    <Text style={styles.guestText}>
                                        Continue as guest →
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content} >
                    <View style={styles.formGroup} >
                        <Text style={styles.label} >
                            Email
                        </Text>

                        <Input
                            value={emailOrPhone}
                            onChangeText={setEmailOrPhone}
                            placeholder="Email or phone"
                        />
                    </View>

                    <View style={styles.formGroup} >
                        <Text style={styles.label} >
                            Password
                        </Text>

                        <PasswordInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                        />

                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => router.push( "/forgot-password" ) }
                        >
                            <Text style={styles.forgotPasswordText}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText} >
                                Log In
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText} >
                            Don't have an
                            account?{" "}
                            <Text style={styles.registerAction} onPress={() => router.push("/register")} >
                                Sign Up
                            </Text>
                        </Text>
                    </View>
                </ScrollView>

                {!isDesktop && (
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.guestButton} onPress={() => router.replace("/main")} >
                            <Text style={styles.guestText}>
                                or Continue as guest
                            </Text>

                            <Text style={styles.guestArrow}>
                                →
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <AppModal
                visible={modalVisible}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}