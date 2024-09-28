/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { useTranslation } from "react-i18next";
import SignatureScreen from "react-native-signature-canvas";

import { Text, View } from "@components/Themed";

import { styles, webStyle } from "./Signature.styles";
import { ISignature } from "./Signature.types";
export default function Signature({ refSignature, handleOK }: ISignature) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const handleEnd = () => {
    refSignature.current?.readSignature();
  };
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("ACTIONS.SIGNATURE")}</Text>
      <SignatureScreen
        ref={refSignature}
        onEnd={handleEnd}
        onOK={handleOK}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
        style={styles.signatureBox}
        webStyle={webStyle}
      />
    </View>
  );
}
