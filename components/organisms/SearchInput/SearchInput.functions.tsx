import { useCallback, useState } from "react";

import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";

import { SearchItem, UseSearchDataProps } from "./SearchInput.types";
import { debounce } from "@utils/index";

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
        // Aquí va la lógica de tu búsqueda, por ejemplo, hacer una petición a una API
        setTimeout(() => {
          setData([
            { label: "name 01", value: "123", href: "/ShipmentDetails" },
            { label: "name 02", value: "124", href: "/ShipmentDetails" },
            { label: "name 03", value: "125", href: "/ShipmentDetails" },
            { label: "name 04", value: "126", href: "/ShipmentDetails" },
            { label: "name 05", value: "127", href: "/ShipmentDetails" },
            { label: "name 06", value: "128", href: "/ShipmentDetails" },
            { label: "name 07", value: "129", href: "/ShipmentDetails" },
            { label: "name 08", value: "130", href: "/ShipmentDetails" },
            { label: "name 09", value: "131", href: "/ShipmentDetails" },
            { label: "name 10", value: "132", href: "/ShipmentDetails" },
            { label: "name 11", value: "133", href: "/ShipmentDetails" },
            { label: "name 12", value: "134", href: "/ShipmentDetails" },
            { label: "name 13", value: "135", href: "/ShipmentDetails" },
            { label: "name 14", value: "136", href: "/ShipmentDetails" },
            { label: "name 15", value: "137", href: "/ShipmentDetails" },
            { label: "name 16", value: "138", href: "/ShipmentDetails" },
            { label: "name 17", value: "139", href: "/ShipmentDetails" },
          ]);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("🚀 ~ useSearchData ~ error:", error);
        setError("Error");
        Toast.show(t("ERRORS.UNKNOWN"));
        setLoading(false);
      }
    },
    [text]
  );

  const handleSearch = useCallback(
    debounce((text: string) => {
      handleSearchRequest(text);
    }, 300),
    [handleSearchRequest]
  );

  return { data, setData, loading, error, handleSearch, open, setOpen };
};
