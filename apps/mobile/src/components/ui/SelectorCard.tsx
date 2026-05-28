import { TouchableOpacity, Text, View, StyleSheet, Image, } from "react-native";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";
import { typography } from "@/styles/theme/typography";

interface Props {
  title: string;
  subtitle?: string;
  active?: boolean;
  icon: any;
  onPress: () => void;
}

export default function SelectorCard({
  title,
  subtitle,
  active,
  icon,
  onPress,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[ styles.card, active && styles.activeCard, ]} >
      <Image source={icon} style={[ styles.icon, active && styles.activeIcon, ]} />

      <View>
        <Text style={[  styles.title, active && styles.activeText, ]} >
          {title}
        </Text>

        {subtitle && (
          <Text style={[ styles.subtitle, active && styles.activeText, ]} >
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(104,93,93,0.5)",
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  activeCard: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },

  icon: {
    width: 42,
    height: 42,
    marginBottom: 12,
    tintColor: colors.title,
  },

  activeIcon: {
    tintColor: "#FFF",
  },

  title: {
    color: colors.title,
    textAlign: "center",
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.title,
    fontWeight: typography.weight.bold as any,
  },

  subtitle: {
    marginTop: 4,
    textAlign: "center",
    color: colors.title,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
  },

  activeText: {
    color: "#FFF",
  },
});