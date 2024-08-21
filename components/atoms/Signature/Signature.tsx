/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

import { Text, View } from "@components/Themed";

import { styles } from "./Signature.styles";
import { ISignature } from "./Signature.types";
export default function Signature({ handleOK }: ISignature) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  const ref = useRef<SignatureViewRef>(null);
  // --- END: Refs -------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("ACTIONS.SIGNATURE")}</Text>
      <SignatureScreen
        ref={ref}
        onOK={handleOK}
        webStyle={`body,html {width: auto; heigth: 100;}`}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
      />
    </View>
  );
}
