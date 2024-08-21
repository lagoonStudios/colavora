import { SignatureViewRef } from "react-native-signature-canvas";

export interface ISignature {
  handleOK: (signature: string) => void;
  refSignature: React.RefObject<SignatureViewRef>;
}
