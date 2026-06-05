import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator,} from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";
import api from "@/services/api/api";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import AppModal from "@/components/ui/AppModal";
import { useResponsive } from "@/hooks/useResponsive";
import { createStyles } from "../styles/forgotPassword.styles";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const {isDesktop, isTablet,} = useResponsive();
  const styles = createStyles(isDesktop, isTablet);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword,] = useState("");
  const [modalVisible, setModalVisible, ] = useState(false);
  const [modalTitle, setModalTitle, ] = useState("");
  const [modalMessage, setModalMessage, ] = useState("");

  const openModal = ( title: string, message: string ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const sendCode = async () => {
    try {
      setLoading(true);
      await api.post( "/auth/forgot-password",{ email,} );
      setStep(2);
    } catch (error: any) {
      openModal(
        "Error",
        error?.response?.data
          ?.message ??
          "Could not send code"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyCode =
    async () => {
      try {
        setLoading(true);
        await api.post(
          "/auth/verify-reset-code",
          {
            email,
            code,
          }
        );

        setStep(3);
      } catch (error: any) {
        openModal(
          "Error",
          error?.response?.data
            ?.message ??
            "Invalid code"
        );

      } finally {
        setLoading(false);
      }
    };

  const resetPassword =
    async () => {

      if (password !== confirmPassword) {
        openModal(
          "Error",
          "Passwords do not match"
        );
        return;
      }

      if (!PASSWORD_REGEX.test( password )) {
        openModal(
          "Error",
          "Password must contain at least 8 characters, 1 uppercase letter and 1 number"
        );
        return;
      } try {
        setLoading(true);
        await api.post(
          "/auth/reset-password",
          {
            email,
            password,
            password_confirmation: confirmPassword,
          }
        );

        openModal( "Success","Password updated successfully");
        setTimeout(() => { router.replace( "/login"); }, 1500);
      } catch (error: any) {
        openModal(
          "Error",
          error?.response?.data
            ?.message ??
            "Could not update password"
        );

      } finally {
        setLoading(false);
      }
    };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} >
        {step === 1 && (
          <>
            <Text style={styles.title}>
              Recover Password
            </Text>

            <Text style={styles.subtitle}>
              Enter your email address and we will send a verification code.
            </Text>

            <View style={ styles.formGroup } >
              <Text style={ styles.label } >
                Email
              </Text>

              <Input value={email} onChangeText={ setEmail } placeholder="example@email.com" />
            </View>

            <TouchableOpacity style={ styles.button } onPress={sendCode} >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={ styles.buttonText } >
                  Send Code
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>
              Verify Code
            </Text>

            <Text style={styles.subtitle}>
              Enter the code sent
              to your email.
            </Text>

            <Input value={code} onChangeText={ setCode } placeholder="123456" />

            <TouchableOpacity style={ styles.button } onPress={ verifyCode } >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={ styles.buttonText } >
                  Verify
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>
              New Password
            </Text>

            <Text style={styles.subtitle}>
              Create a new password for your account.
            </Text>

            <View style={ styles.formGroup } >
              <Text style={ styles.label } >
                Password
              </Text>

              <PasswordInput
                value={password}
                onChangeText={ setPassword }
                placeholder="8 chars, 1 uppercase, 1 number"
              />
            </View>

            <View style={  styles.formGroup } >
              <Text style={ styles.label } >
                Confirm Password
              </Text>

              <PasswordInput value={ confirmPassword } onChangeText={ setConfirmPassword } placeholder="Repeat password" />
            </View>

            <TouchableOpacity style={ styles.button } onPress={ resetPassword } >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={ styles.buttonText } >
                  Update Password
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <AppModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false) }
      />
    </View>
  );
}