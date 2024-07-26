import { OrderListItemProps } from "@molecules/OrderListItem/OrderList.types";
import { useEffect, useState } from "react";

export function useOrdersListData() {
  // --- Local state -----------------------------------------------------------
  const [data, setData] = useState<OrderListItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  // --- END: Local state ------------------------------------------------------
  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    setData([
      {
        id: "1",
        companyName: "Company name test 01 test",
        name: "Name 01 test long name test",
        serviceType: "Next Day",
        city: "City 1",
        zipCode: "12345",
        direction:
          "lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
        dueDate: "2023-01-01",
        bill: "bill 1",
        pieces: 1,
      },
      {
        id: "2",
        companyName: "Company 2",
        name: "Name 2",
        serviceType: "Next Day",
        city: "City 2",
        zipCode: "12345",
        direction: "direction 2",
        dueDate: "2023-01-02",
        bill: "bill 2",
        pieces: 2,
      },
      {
        id: "3",
        companyName: "Company 3",
        name: "Name 3",
        serviceType: "Next Day",
        city: "City 3",
        zipCode: "12345",
        direction: "direction 3",
        dueDate: "2023-01-03",
        bill: "bill 3",
        pieces: 3,
      },
      {
        id: "4",
        companyName: "Company 4",
        name: "Name 4",
        serviceType: "Next Day",
        city: "City 4",
        zipCode: "12345",
        direction: "direction 4",
        dueDate: "2023-01-04",
        bill: "bill 4",
        pieces: 4,
      },
      {
        id: "5",
        companyName: "Company 5",
        name: "Name 4",
        serviceType: "Next Day",
        city: "City 5",
        zipCode: "12345",
        direction: "direction 5",
        dueDate: "2023-01-05",
        bill: "bill 5",
        pieces: 5,
      },
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
