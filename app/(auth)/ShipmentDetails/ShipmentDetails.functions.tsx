import { IFetchOrderData } from "@constants/types";
import { useEffect, useState } from "react";

export const useShipmentDetailsData = (id: string | undefined) => {
  // --- Hooks -----------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<IFetchOrderData>();
  // --- END: Hooks ------------------------------------------------------------
  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (id == undefined) {
      setError(new Error("No shipment ID provided"));
      return;
    }

    setLoading(true);
    setData({
      companyID: "10030",
      shipmentID: 81997,
      waybill: "231129MND049",
      serviceType: 1,
      serviceTypeName: "NEXT DAY",
      packageType: 1,
      readyDate: new Date("2023-11-29T14:52:00"),
      dueDate: new Date("2023-11-30T21:00:00"),
      codType: "None",
      codAmount: 100.0,
      sender: "MND",
      senderName: "MASCARO - PORTER (NEXT DAY)",
      senderAddressLine1: "REPARTO INDUSTRIAL BECHARA 217 CALLE SEGARRA",
      senderAddressLine2: "ESQ CALLE BLAY KM. 3.4 AVENIDA KENEDY",
      senderZip: "00920",
      senderPhoneNumber: "(787) 782-4121",
      senderContactPerson: "",
      orderNotes: "",
      consigneeNum: "",
      consigneeName: "08829 FRANKY TIRE CENTER",
      addressLine1: "CARR 3 KM 84.7",
      addressLine2: "BO. CATANO",
      zip: "00791",
      phoneNumber: "(787) 850-3408",
      contactPerson: "",
      createdUserID: 13960,
      createdDate: new Date("2023-11-29T11:50:47.053"),
      lastTransferDate: new Date("1900-01-01T00:00:00"),
      status: "Delivered",
      qty: 2,
      items: null,
      templateID: 1,
      manifestDL: "80820240123",
      manifestPk: "80120231129",
      assignPK: 13961,
      assignDL: 13995,
      division: "",
      lastEventComment: null,
      reason: null,
      barcode:
        "23082510152003003 ,23082510152003004 ,23082510152003002 ,23082510152003001 ,230825003 ",
      referenceNo: 123,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // --- END: Side effects -----------------------------------------------------
  return { loading, error, data };
};
