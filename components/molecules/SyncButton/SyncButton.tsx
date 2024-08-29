import Button from "@atoms/Button";
import { Alert } from "react-native";
import { useStore } from "@stores/zustand";
import Toast from "react-native-root-toast";
import { resetDatabase } from "@hooks/SQLite";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@components/Themed";
import { useColorScheme } from "@components/useColorScheme";
import { useIsConnected } from "react-native-offline";

export default function SyncButton() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { setVisible, setModal } = useStore();
  const theme = useThemeColor({}, "primary");
  const colorScheme = useColorScheme();
  const isConnected = useIsConnected();
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleClearCache = () => {
    if (!isConnected) {
      console.log({ isConnected });
      Alert.alert(t("NETWORK_ERROR.TITLE"), t("NETWORK_ERROR.DESCRIPTION"));
      return;
    }

    Alert.alert(
      t("SYNC_BUTTON.TITLE"),
      t("SYNC_BUTTON.DESCRIPTION"),
      [
        {
          text: t("COMMON.CANCEL"),
          style: "cancel",
        },
        {
          text: t("COMMON.ACCEPT"),
          onPress: () => {
            setModal(t("SYNC_BUTTON.CLEANING"));
            resetDatabase()
              .then(() => {
                setVisible(false);
                Toast.show(t("SYNC_BUTTON.SUCCESS"));
              })
              .catch((error) => {
                setVisible(false);
                Toast.show(t("SYNC_BUTTON.ERROR"));
                console.error(
                  "🚀 ~ file: SyncButton.tsx:26 ~ resetDatabase ~ error:",
                  error
                );
              });
          },
        },
      ],
      {
        cancelable: true,
        userInterfaceStyle: colorScheme ? colorScheme : "light",
      }
    );
  };
  // --- END: Data and handlers ------------------------------------------------
  return (
    <Button
      onPress={handleClearCache}
      label={t("SYNC_BUTTON.TITLE")}
      style={{ backgroundColor: theme.default }}
      labelStyle={{ color: theme.contrast }}
    />
  );
}
