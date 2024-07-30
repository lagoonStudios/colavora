import { debounce } from "@utils/debounce";
import { useCallback, useState } from "react";

export const useSearchData = (text: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchRequest = useCallback(
    (text: string) => {
      setLoading(true);
      // Aquí va la lógica de tu búsqueda, por ejemplo, hacer una petición a una API
      setTimeout(() => {
        setData([
          {
            label: "Manifests",
            value: "manifests",
          },
          { label: "Orders", value: "orders" },

          {
            label: "Name 01 test long name test",
            value: "123",
            shipmentID: 123,
            consigneeName:
              "lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
            senderName: "Name 01 test long name test",
            addressLine1: "Address line 1",
            addressLine2: "Address line 2",
            zip: "12345",
            serviceTypeName: "Next Day",
            referenceNo: 1234556,
            qty: 12,
            parent: "manifests",
            href: "/ShipmentDetails",
          },
          {
            label: "Name 02 test long name test",
            value: "1234",
            shipmentID: 1234,
            consigneeName: "Name 02 test long name test",
            senderName: "Name 02 test long name test",
            addressLine1: "Address line 1",
            addressLine2: "Address line 2",
            zip: "12345",
            serviceTypeName: "Next Day",
            referenceNo: 987654321,
            qty: 24,
            parent: "manifests",
            href: "/ShipmentDetails",
          },

          {
            label: "Name 03 test long name test",
            value: "12345",
            shipmentID: 12345,
            consigneeName: "Name 03 test long name test",
            senderName: "Name 03 test long name test",
            addressLine1: "Address line 1",
            addressLine2: "Address line 2",
            zip: "12345",
            serviceTypeName: "Next Day",
            referenceNo: 987654321,
            qty: 24,
            parent: "orders",
            href: "/ShipmentDetails",
          },
          {
            label: "Name 04 test long name test",
            value: "123456",
            shipmentID: 123456,
            consigneeName: "Name 04 test long name test",
            senderName: "Name 04 test long name test",
            addressLine1: "Address line 1",
            addressLine2: "Address line 2",
            zip: "12345",
            serviceTypeName: "Next Day",
            referenceNo: 987654321,
            qty: 24,
            parent: "orders",
            href: "/ShipmentDetails",
          },
          {
            label: "Name 05 test long name test",
            value: "1234567",
            shipmentID: 1234567,
            consigneeName: "Name 05 test long name test",
            senderName: "Name 05 test long name test",
            addressLine1: "Address line 1",
            addressLine2: "Address line 2",
            zip: "12345",
            serviceTypeName: "Next Day",
            referenceNo: 987654321,
            qty: 24,
            parent: "orders",
            href: "/ShipmentDetails",
          },
        ]);
        setLoading(false);
      }, 300);
    },
    [text]
  );

  const handleSearch = useCallback(
    debounce((text: string) => {
      handleSearchRequest(text);
    }, 700),
    [handleSearchRequest]
  );

  return { data, setData, loading, error, handleSearch };
};
