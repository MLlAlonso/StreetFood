import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";

import styles from "./TimePickerInput.styles";

interface Props {
    value: string | null;
    placeholder?: string;
    onChange(value: string): void;
}

export default function TimePickerInput({ value, placeholder = "08:00", onChange, }: Props) {
    const [text, setText] = useState(value?.substring(0, 5) ?? "");

    useEffect(() => {
        const formatted = value?.substring(0, 5) ?? "";

        if (formatted !== text) {
            setText(formatted);
        }
    }, [value]);

    const handleChange = (input: string) => {
        let digits = input.replace(/\D/g, "");

        if (digits.length > 4) {
            digits = digits.slice(0, 4);
        }

        if (digits.length <= 2) {
            setText(digits);
        } else {
            setText(
                `${digits.slice(0, 2)}:${digits.slice(2)}`
            );
        }
    };

    const handleBlur = () => {
        const digits = text.replace(/\D/g, "");

        if (digits.length !== 4) {
            setText(value?.substring(0, 5) ?? "");
            return;
        }

        let hours = parseInt(digits.slice(0, 2), 10);
        let minutes = parseInt(digits.slice(2, 4), 10);

        if (isNaN(hours) || isNaN(minutes)) {
            setText(value?.substring(0, 5) ?? "");
            return;
        }

        if (hours < 4) {
            hours = 4;
            minutes = 0;
        }

        if (hours > 23) {
            hours = 23;
        }

        if (minutes > 59) {
            minutes = 59;
        }

        const finalValue = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

        setText(finalValue);
        onChange(finalValue);
    };

    return (
        <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder={placeholder}
            value={text}
            maxLength={5}
            onChangeText={handleChange}
            onBlur={handleBlur}
        />
    );
}