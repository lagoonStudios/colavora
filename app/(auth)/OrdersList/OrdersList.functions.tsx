import { TOrderListItemProps } from "@molecules/OrderListItem/OrderList.types";
import { useEffect, useState } from "react";

export function useOrdersListData() {
  // --- Local state -----------------------------------------------------------
  const [data, setData] = useState<TOrderListItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  // --- END: Local state ------------------------------------------------------
  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    setData([
      {
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
      },
      {
        shipmentID: 1234,
        consigneeName: "Name 02 test long name test",
        senderName: "Name 02 test long name test",
        addressLine1: "Address line 1",
        addressLine2: "Address line 2",
        zip: "12345",
        serviceTypeName: "Next Day",
        referenceNo: 987654321,
        qty: 24,
      },
      {
        shipmentID: 12345,
        consigneeName: "Name 03 test long name test",
        senderName: "Name 03 test long name test",
        addressLine1: "Address line 1",
        addressLine2: "Address line 2",
        zip: "12345",
        serviceTypeName: "Next Day",
        referenceNo: 987654321,
        qty: 24,
      },
      {
        shipmentID: 123456,
        consigneeName: "Name 04 test long name test",
        senderName: "Name 04 test long name test",
        addressLine1: "Address line 1",
        addressLine2: "Address line 2",
        zip: "12345",
        serviceTypeName: "Next Day",
        referenceNo: 987654321,
        qty: 24,
      },
      {
        shipmentID: 1234567,
        consigneeName: "Name 05 test long name test",
        senderName: "Name 05 test long name test",
        addressLine1: "Address line 1",
        addressLine2: "Address line 2",
        zip: "12345",
        serviceTypeName: "Next Day",
        referenceNo: 987654321,
        qty: 24,
      },
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
