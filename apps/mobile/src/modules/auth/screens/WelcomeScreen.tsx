import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";

import Button from "@/components/ui/Button";

import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Discover the{" "}
          <Text style={styles.highlight}>
            best street food
          </Text>{" "}
          near you
        </Text>

        <Text style={styles.subtitle}>
          Explore food trucks, taco stands & hidden gems in real time
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Sign Up"
          backgroundColor={colors.tertiary}
          onPress={() => router.push("/register")}
        />

        <Button
          title="Log In"
          backgroundColor={colors.text}
          style={{
            marginTop: spacing.md,
          }}
          onPress={() => router.push("/login")}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.guestContainer}
          onPress={() => router.replace("/main")}
        >
          <Text style={styles.guestText}>
            <Text style={styles.orText}>or </Text>
            Continue as guest →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 120,
    paddingBottom: 50,
  },

  content: {
    alignItems: "center",
  },

  logo: {
    width: 260,
    height: 260,
    marginBottom: spacing.xl,
  },

  title: {
    color: "#FFF",
    textAlign: "center",
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.title,
    fontWeight: typography.weight.bold as any,
    lineHeight: 42,
  },

  highlight: {
    color: colors.secondary,
  },

  subtitle: {
    marginTop: spacing.lg,
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.body,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },

  footer: {
    width: "100%",
  },

  guestContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },

  guestText: {
    color: colors.tertiary,
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.body,
  },

  orText: {
    color: "#FFF",
  },
});