import * as ImagePicker from "expo-image-picker";

const CLOUD_NAME = "dhzmsgmq2";
const UPLOAD_PRESET = "streetfood_unsigned";

export const pickImage = async () => {
    const result =
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
};

export const uploadToCloudinary = async ( imageUri: string) => {
    const formData = new FormData();

    formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
    } as any);

    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    formData.append(
        "folder",
        "streetfood"
    );

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data = await response.json();
    if (!response.ok) {
        console.log(
            "CLOUDINARY ERROR:",
            data
        );

        throw new Error(
            data?.error?.message ||
            "Upload failed"
        );
    }
    return data.secure_url;
};