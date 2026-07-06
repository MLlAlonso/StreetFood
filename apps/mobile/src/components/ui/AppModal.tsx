import { Modal, View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";
import { useTranslation } from "@/translations/hooks/useTranslation";
interface Props { visible: boolean; title: string; message: string; buttonText?: string; onClose: () => void; }

export default function AppModal({ visible, title, message, buttonText, onClose, }: Props) {
  const { t } = useTranslation();
  const text = buttonText ?? t("accept");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose} >
            <Text style={styles.buttonText}>
              {text}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
  },

  title: {
    color: colors.title,
    fontSize: 24,
    fontFamily: typography.fontFamily.title,
    fontWeight: typography.weight.bold as any,
    marginBottom: 12,
  },

  message: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },

  button: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: typography.fontFamily.title,
    fontWeight: typography.weight.bold as any,
  },
});