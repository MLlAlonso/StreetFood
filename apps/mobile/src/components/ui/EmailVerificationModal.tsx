import { Modal, View, Text, TouchableOpacity, StyleSheet,} from "react-native";

import Input from "@/components/ui/Input";
import { colors } from "@/styles/theme/colors";
import { typography } from "@/styles/theme/typography";

interface Props {
  visible: boolean;
  code: string;
  setCode: (value: string) => void;
  loading?: boolean;
  onCancel: () => void;
  onAccept: () => void;
}

export default function EmailVerificationModal({ visible, code, setCode, loading, onCancel, onAccept,}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            Verify your email address
          </Text>

          <Input value={code} onChangeText={setCode} placeholder="123456"/>

          <Text style={styles.message}>
            We’ve sent a verification code to your email.
            If you don’t see it, check your inbox,
            spam, or junk folder.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={onAccept} disabled={loading} >
              <Text style={styles.acceptText}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 500,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
  },

  title: {
    fontSize: 24,
    color: colors.title,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  message: {
    marginTop: 16,
    color: colors.text,
    lineHeight: 22,
    textAlign: "justify",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  acceptButton: {
    flex: 1,
    height: 52,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: colors.text,
    fontWeight: "600",
  },

  acceptText: {
    color: "#FFF",
    fontWeight: "700",
  },
});