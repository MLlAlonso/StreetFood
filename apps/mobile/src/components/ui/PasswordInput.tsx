import { View, TextInput, TouchableOpacity, Text, StyleSheet,} from "react-native";

import { useState } from "react";
import { colors } from "@/styles/theme/colors";
import { spacing } from "@/styles/theme/spacing";

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export default function PasswordInput({value, onChangeText, placeholder, }: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={hidden}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setHidden(!hidden) } >
        <Text style={styles.eye}>
          {hidden ? "👁" : "👁"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(38,39,48,0.2)",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  input: {
    flex: 1,
  },

  eye: {
    fontSize: 20,
  },
});