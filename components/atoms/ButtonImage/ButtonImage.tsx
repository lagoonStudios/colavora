import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Text } from "@components/Themed";

import { styles as defaultStyles, styles } from "./ButtonImage.styles";
import { IButtonImage } from "./ButtonImage.types";

export default function ButtonImage({ pickImage, photoImage }: IButtonImage) {
  // --- Hooks -----------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const mimeType = useMemo(
    () => photoImage?.mimeType ?? t("ACTIONS.CHOOSE_FILE"),
    [photoImage?.mimeType, t],
  );

  const fileName = useMemo(() => {
    return photoImage?.fileName
      ? photoImage?.fileName?.substring(0, 25) + "..."
      : t("ACTIONS.NO_FILE");
  }, [photoImage?.fileName, t]);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onPressHandler = () => {
    pickImage();
  };
  // --- END: Data and handlers ------------------------------------------------
  return (
    <Pressable style={defaultStyles.container} onPress={onPressHandler}>
      <Feather
        name="paperclip"
        color="black"
        size={23}
        style={{
          marginLeft: 1,
          height: 25,
          width: 25,
          textAlign: "center",
          textAlignVertical: "center",
        }}
      />
      <Text style={styles.mimeType}>{mimeType}</Text>
      <Text style={styles.fileName} adjustsFontSizeToFit>
        {fileName}
      </Text>
    </Pressable>
  );
}
