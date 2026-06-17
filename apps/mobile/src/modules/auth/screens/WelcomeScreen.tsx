import { View, Text, StyleSheet, Image, TouchableOpacity, } from "react-native";

import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";
import { useResponsive } from "@/hooks/useResponsive";

export default function WelcomeScreen() {
  const { isDesktop, isTablet, } = useResponsive();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.wrapper,
          isDesktop &&
          styles.desktopWrapper,
        ]}
      >
        <View
          style={[
            styles.content,
            isDesktop &&
            styles.desktopContent,
          ]}
        >
          <Image
            source={require("@/assets/logo/logo.png")}
            style={[
              styles.logo,
              isTablet && { width: 320, height: 320, },
              isDesktop && { width: 420, height: 420, marginBottom: 0, },
            ]}
            resizeMode="contain"
          />

          <View style={[ isDesktop && { flex: 1, maxWidth: 500, }, ]} >
            <Text
              style={[
                styles.title,
                isDesktop && { textAlign: "left", fontSize: 42, lineHeight: 56, },
              ]}
            >
              Discover the{" "}
              <Text style={styles.highlight}>
                best street food
              </Text>{" "}
              near you
            </Text>

            <Text
              style={[
                styles.subtitle,

                isDesktop && {
                  textAlign: "left",
                  paddingHorizontal: 0,
                  fontSize: 18,
                  lineHeight: 30,
                },
              ]}
            >
              Explore food trucks, taco stands &
              hidden gems in real time
            </Text>

            <View
              style={[
                styles.footer,
                isDesktop && { marginTop: 40, },
              ]}
            >
              <Button
                title="Sign Up"
                backgroundColor={ colors.tertiary }
                onPress={() => router.push("/register") }
              />

              <Button
                title="Log In"
                backgroundColor={ colors.text }
                style={{ marginTop: spacing.md, }}
                onPress={() => router.push("/login") }
              />

              <TouchableOpacity
                activeOpacity={0.7}
                style={ styles.guestContainer }
                onPress={() => router.replace("/main") }
              >
                <Text style={ styles.guestText } >
                  <Text style={ styles.orText } > or{" "} </Text>
                  Continue as guest →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 0,
    paddingBottom: 40,
  },

  desktopWrapper: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
  },

  desktopContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 80,
  },

  logo: {
    width: 260,
    height: 260,
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
    marginTop: 50,
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