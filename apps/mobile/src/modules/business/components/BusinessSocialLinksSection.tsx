import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, } from "react-native";
import { BusinessSocialLink, BusinessSocialType, } from "../types/BusinessSocialLink";
import styles from "../styles/BusinessSocialLinksSection.styles";

interface Props {
    links: BusinessSocialLink[];
    onChange(value: BusinessSocialLink[]): void;
}

const OPTIONS: { label: string; value: BusinessSocialType; }[] = [
    {
        label: "Website",
        value: "website",
    },
    {
        label: "Instagram",
        value: "instagram",
    },
    {
        label: "WhatsApp",
        value: "whatsapp",
    },
    {
        label: "Facebook",
        value: "facebook",
    },
    {
        label: "Uber Eats",
        value: "uber_eats",
    },
    {
        label: "Rappi",
        value: "rappi",
    },
    {
        label: "DiDi Food",
        value: "didi_food",
    },
];

export default function BusinessSocialLinksSection({ links, onChange, }: Props) {
    const [opened, setOpened] = useState<number | null>(null);

    function addLink() {
        if (links.length >= 3) {
            return;
        }

        onChange([
            ...links,
            {
                type: "website",
                url: "",
            },
        ]);
    }

    function remove(index: number) {
        const copy = [...links];
        copy.splice(index, 1);
        onChange(copy);
    }

    function updateUrl(index: number, url: string) {
        const copy = [...links];
        copy[index].url = url;
        onChange(copy);
    }

    function updateType(index: number, type: BusinessSocialType) {
        // Evitar duplicados
        const exists = links.some(
            (item, i) =>
                i !== index &&
                item.type === type
        );

        if (exists) {
            setOpened(null);
            return;
        }

        const copy = [...links];
        copy[index].type = type;
        onChange(copy);
        setOpened(null);
    }

    function getPlaceholder(type: BusinessSocialType) {
        switch (type) {
            case "instagram":
                return "Username";

            case "whatsapp":
                return "Phone number";

            case "website":
                return "https://";

            case "facebook":
                return "https://facebook.com/...";

            case "uber_eats":
                return "https://ubereats.com/...";

            case "rappi":
                return "https://rappi.com/...";

            case "didi_food":
                return "https://didifood.com/...";

            default:
                return "Link";
        }
    }

    function normalizeUrl(type: BusinessSocialType, value: string) {
        value = value.trim();
        switch (type) {
            case "instagram":
                value = value.replace("@", "");

                if (!value.startsWith("http")) {
                    return `https://instagram.com/${value}`;
                }

                return value;
            case "whatsapp":
                let phone = value.replace(/\D/g, "");

                if (!phone.startsWith("52")) {
                    phone = "52" + phone;
                }

                return `https://wa.me/${phone}`;
            default:
                return value;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Social Links
            </Text>

            <Text style={styles.subtitle}>
                Add up to 3 social links.
            </Text>

            {
                links.map((link, index) => (
                    <View key={index} style={styles.card} >

                        <Text style={styles.label}>
                            Platform
                        </Text>

                        <TouchableOpacity
                            style={styles.dropdown}
                            activeOpacity={0.8}
                            onPress={() => setOpened(
                                opened === index
                                    ? null
                                    : index
                            )
                            }
                        >

                            <Text style={styles.dropdownText}>
                                {
                                    OPTIONS.find(x => x.value === link.type)?.label
                                }
                            </Text>

                            <Text style={styles.arrow}>
                                ▼
                            </Text>
                        </TouchableOpacity>

                        {
                            opened === index && (
                                <View style={styles.dropdownMenu}>
                                    {
                                        OPTIONS.map(option => {
                                            const selected = links.some(
                                                (item, i) => i !== index && item.type === option.value
                                            );

                                            return (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    disabled={selected}
                                                    style={[styles.option, selected && styles.optionDisabled,]}
                                                    onPress={() => updateType(index, option.value)}
                                                >

                                                    <Text style={[ styles.optionText, selected && styles.optionTextDisabled, ]} >
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </View>
                            )
                        }

                        <Text style={styles.label}>
                            Link
                        </Text>

                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder={getPlaceholder(link.type)}
                            value={link.url}
                            onChangeText={(text) => updateUrl(index, text) }
                            onBlur={() => {
                                const updated = [...links];

                                updated[index] = {
                                    ...updated[index],
                                    url: normalizeUrl(
                                        updated[index].type,
                                        updated[index].url
                                    ),
                                };

                                onChange(updated);
                            }}
                        />

                        <TouchableOpacity style={styles.removeButton} onPress={() => remove(index) } >
                            <Text style={styles.removeText}>
                                Remove
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))
            }

            {
                links.length < 3 && (
                    <TouchableOpacity style={styles.addButton} onPress={addLink} >
                        <Text style={styles.addText}>
                            + Add Link
                        </Text>
                    </TouchableOpacity>
                )
            }
        </View>
    );
}