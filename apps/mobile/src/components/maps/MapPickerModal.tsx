import { Platform } from "react-native";

const MapPickerModal =
    Platform.OS === "web"
        ? require("./MapPickerWeb").default
        : require("./MapPickerMobile").default;

export default MapPickerModal;