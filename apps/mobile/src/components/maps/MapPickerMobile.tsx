import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import MapView, { Marker, MapPressEvent, } from "react-native-maps";

import { colors } from "@/styles/theme/colors";
import { useEffect } from "react";
import * as Location from "expo-location";

interface Props {
    visible: boolean;

    initialLocation?: {
        latitude: number;
        longitude: number;
    };

    onClose: () => void;
    onSelect: (latitude: number, longitude: number) => void;
}

export default function MapPickerMobile({ visible, initialLocation, onClose, onSelect, }: Props) {
    const [marker, setMarker] = useState({
        latitude: 19.4326,
        longitude: -99.1332,
    });

    useEffect(() => {
        const loadLocation = async () => {
            try {
                const permission = await Location.requestForegroundPermissionsAsync();

                if (permission.status !== "granted") {
                    return;
                }

                const current = await Location.getCurrentPositionAsync({});

                setMarker({
                    latitude: current.coords.latitude,
                    longitude: current.coords.longitude,
                });
            } catch (error) {
                console.log(error);
            }
        };

        if (visible) {
            loadLocation();
        }
    }, [visible]);

    const handlePress = (event: MapPressEvent) => {
        const coords = event.nativeEvent.coordinate;
        setMarker(coords);
    };

    const handleConfirm = () => {
        onSelect(marker.latitude, marker.longitude);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Select Location
                    </Text>

                    <TouchableOpacity onPress={onClose} >
                        <Text style={styles.close} >
                            ✕
                        </Text>
                    </TouchableOpacity>
                </View>

                <MapView
                    style={styles.map}
                    region={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onPress={handlePress}
                >
                    <Marker coordinate={marker} />
                </MapView>

                <TouchableOpacity style={styles.button} onPress={handleConfirm} >
                    <Text style={styles.buttonText} >
                        Confirm Location
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        height: 70,
        backgroundColor: colors.primary,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    title: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
    },

    close: {
        color: "#FFF",
        fontSize: 28,
    },

    map: {
        flex: 1,
    },

    button: {
        height: 60,
        backgroundColor: colors.secondary,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },
});