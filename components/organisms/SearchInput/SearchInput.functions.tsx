import { useCallback, useState } from "react";

import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";

import { SearchItem, UseSearchDataProps } from "./SearchInput.types";
import { debounce } from "@utils/index";
import { searchShipments } from "@hooks/SQLite";

export const useSearchData = ({ text }: UseSearchDataProps) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSearchRequest = useCallback(
    (text: string) => {
      try {
        if (text.trim() === "") {
          setLoading(false);
          setOpen(false);
          setData([]);
          return;
        }
        setLoading(true);
        setOpen(true);
        searchShipments({ q: text })
          .then((res) => {
            const data = res.map((shipment) => ({
              label: shipment.consigneeName || "",
              value: String(shipment.shipmentID),
            }));
            setData(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("🚀 ~ useSearchData ~ error:", error);
            setError(error.message);
            Toast.show(t("ERRORS.UNKNOWN"));
            setLoading(false);
          });
      } catch (error) {
        console.error("🚀 ~ useSearchData ~ error:", error);
        setError("Error");
        Toast.show(t("ERRORS.UNKNOWN"));
        setLoading(false);
      }
    },
    [text],
  );

  const handleSearch = useCallback(
    debounce((text: string) => {
      handleSearchRequest(text);
    }, 300),
    [handleSearchRequest],
  );

  return { data, setData, loading, error, handleSearch, open, setOpen };
};
