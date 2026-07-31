import React, { useState } from "react";
import { TouchableOpacity, Text, Platform, } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "./TimePickerInput.styles";

interface Props {
    value: string | null;
    placeholder?: string;
    onChange(value: string): void;
}

export default function TimePickerInput({ value, placeholder = "--:--", onChange, }: Props) {
    const [visible, setVisible] = useState(false);

    const date = value
        ? new Date(`1970-01-01T${value}:00`)
        : new Date();

    const handleConfirm = (selected: Date) => {
        setVisible(false);

        const hours = selected
            .getHours()
            .toString()
            .padStart(2, "0");

        const minutes = selected
            .getMinutes()
            .toString()
            .padStart(2, "0");

        onChange(`${hours}:${minutes}`);
    };

    return (
        <>
            <TouchableOpacity style={styles.input} onPress={() => setVisible(true)} >
                <Text style={styles.text}>
                    {value ?? placeholder}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={visible}
                mode="time"
                date={date}
                onConfirm={handleConfirm}
                onCancel={() => setVisible(false)}
                is24Hour
            />
        </>
    );
}