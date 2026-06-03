import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

const CLOUD_NAME = "dhzmsgmq2";
const UPLOAD_PRESET = "streeteats_unsigned";

export const pickImage = async () => {
  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
    throw new Error(
      "Image must be smaller than 5MB"
    );
  }

  return asset;
};

export const uploadToCloudinary = async ( asset: any ) => {
  const formData = new FormData();

  if (Platform.OS === "web") {
    const responseFile = await fetch(asset.uri);
    const blob = await responseFile.blob();
    formData.append( "file", blob );
} else {
    formData.append(
      "file",
      {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || "upload.jpg",
      } as any
    );
  }

  formData.append( "upload_preset", UPLOAD_PRESET );
  formData.append( "folder", "streetfood" );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
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