import { ImagePickerAsset } from "expo-image-picker";

export interface ICodOptions {
  codTypeID: number;
  codAmount: number;
  codCheck: string;
  createdSource: string;
}

export interface IShipmentActionsComplete {
  podName: string;
  photoImage: ImagePickerAsset;
  signatureImage: string;
  latitude: string;
  longitude: string;
  updateLocation?: boolean;
  comment?: string;
  cods: ICodOptions[];
}
