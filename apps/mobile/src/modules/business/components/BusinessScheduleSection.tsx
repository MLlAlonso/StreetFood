import React from "react";
import { View, Text, Switch, TextInput, } from "react-native";

import { BusinessHour } from "../types/BusinessHour";
import TimePickerInput from "@/components/forms/TimePickerInput";
import styles from "../styles/BusinessScheduleSection.styles";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

interface Props {
    enabled: boolean;
    hours: BusinessHour[];
    onToggleEnabled(value: boolean): void;
    onHoursChange(hours: BusinessHour[]): void;
}

export default function BusinessScheduleSection({ enabled, hours, onToggleEnabled, onHoursChange, }: Props) {
    const updateHour = (index: number, field: keyof BusinessHour, value: any) => {
        const copy = [...hours];

        copy[index] = {
            ...copy[index],
            [field]: value,
        };

        onHoursChange(copy);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>
                        Business Hours
                    </Text>


                    <Text style={styles.subtitle}>
                        Set your business hours.
                    </Text>
                </View>

                <Switch value={enabled} onValueChange={onToggleEnabled} />
            </View>

            {!enabled && null}

            {enabled &&
                hours.map((day, index) => (
                    <View key={day.day_of_week} style={styles.dayCard} >
                        <View style={styles.dayHeader}>
                            <Text style={styles.dayTitle}>
                                {DAYS[day.day_of_week]}
                            </Text>

                            <Switch value={day.enabled} onValueChange={(value) => updateHour(index, "enabled", value)} />
                        </View>

                        {day.enabled && (
                            <View style={styles.timeRow}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Open
                                    </Text>

                                    <TimePickerInput value={day.open_time} onChange={(time) => updateHour(index, "open_time", time)} />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        Close
                                    </Text>

                                    <TimePickerInput value={day.close_time} onChange={(time) => updateHour(index, "close_time", time)} />
                                </View>
                            </View>
                        )}
                    </View>
                ))}
        </View>
    );
}