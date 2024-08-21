import * as ImagePicker from "expo-image-picker";

export interface IButtonImage {
  pickImage: () => Promise<void>;
  photoImage: ImagePicker.ImagePickerAsset;
}
