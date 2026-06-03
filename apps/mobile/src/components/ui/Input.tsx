import { TextInput, StyleSheet, } from "react-native";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";
import { useResponsive } from "@/hooks/useResponsive";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}: Props) {

  const { isDesktop } = useResponsive();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(38,39,48,0.5)"
      secureTextEntry={secureTextEntry}
      style={[
        styles.input,

        isDesktop && {
          height: 65,
          fontSize: 18,
          paddingHorizontal: 20,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 60,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(38,39,48,0.2)",
    borderRadius: 15,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.body,
  },
});