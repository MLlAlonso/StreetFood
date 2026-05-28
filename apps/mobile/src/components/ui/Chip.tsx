import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/styles/theme/colors";

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function Chip({
  label,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[ styles.chip, selected && styles.selected, ]} >
      <Text style={[ styles.text, selected && styles.selectedText, ]} >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    marginBottom: 10,
  },

  selected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },

  text: {
    color: colors.primary,
  },

  selectedText: {
    color: "#FFF",
    fontWeight: "700",
  },
});