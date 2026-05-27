import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { colors } from "@/styles/theme/colors";
import { radius } from "@/styles/theme/radius";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";

interface ButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  backgroundColor = colors.secondary,
  textColor = "#FFF",
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: spacing.md,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semiBold as any,
  },
});