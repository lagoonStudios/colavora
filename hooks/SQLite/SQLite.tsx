import { useEffect } from "react";
import { openDatabaseSync } from "expo-sqlite";

import { createAllDBTables } from "./SQLite.functions";

const DB_NAME = "test.db";
export const db = openDatabaseSync(DB_NAME);

export default function useSQLite() {
  useEffect(() => {
    try {
      createAllDBTables(db).then((res) => {});
    } catch (error) {
      console.log("🚀 ~  useSQLite ~ error:", error);
    }
  }, []);

  return;
}
/** Insert mock data */
// function insertData(db: SQLiteDatabase) {
//   insertMultipleManifests(db, [
//     {
//       manifest: "1234567891",
//       companyID: "1234567890",
//       shipmentID: 2,
//       manifestID: 1234567890,
//       driverID: 1234567890,
//       createdDate: new Date().toISOString(),
//     },
//     {
//       manifest: "1234567890",
//       companyID: "1234567890",
//       shipmentID: 2,
//       manifestID: 1234567890,
//       driverID: 1234567890,
//       createdDate: "2024-05-20T00:01:00",
//     },
//   ])
//     .then((res) => {
//       console.log("INSERTED MANIFESTS", res);
//     })
//     .catch((error) => {
//       console.log("ERROR MANIFESTS", error);
//     });

//   insertMultipleShipments(db, [
//     {
//       companyID: "1234567890",
//       shipmentID: 2,
//       waybill: "1234567890",
//       serviceType: 1,
//       serviceTypeName: "Servicio",
//       packageType: 1,
//       readyDate: "2024-05-20T00:01:00",
//       dueDate: new Date().toISOString(),
//       codType: "1234567890",
//       codAmount: 1234567890,
//       sender: "1234567890",
//       senderName: "1234567890",
//       senderAddressLine1: "1234567890",
//       senderAddressLine2: "1234567890",
//       senderZip: "1234567890",
//       senderPhoneNumber: "1234567890",
//       senderContactPerson: "1234567890",
//       orderNotes: "1234567890",
//       consigneeNum: "1234567890",
//       consigneeName: "1234567890",
//       addressLine1: "1234567890",
//       addressLine2: "1234567890",
//       zip: "1234567890",
//       phoneNumber: "1234567890",
//       contactPerson: "1234567890",
//       createdUserID: 1234567890,
//       createdDate: "2024-05-20T00:01:00",
//       lastTransferDate: "2024-05-20T00:01:00",
//       status: "1234567890",
//       qty: 1234567890,
//       templateID: 1234567890,
//       manifestDL: "1234567890",
//       manifestPk: "1234567890",

//       assignPK: 1234567890,
//       assignDL: 1234567890,
//       division: "1234567890",
//       lastEventComment: "1234567890",
//       reason: "1234567890",
//       barcode: "1234567890",
//       referenceNo: "1234567890",
//     },
//     {
//       companyID: "1234567890",
//       shipmentID: 3,
//       waybill: "1234567890",
//       serviceType: 1,
//       serviceTypeName: "Servicio",
//       packageType: 1,
//       readyDate: "2024-05-20T00:01:00",
//       dueDate: new Date("2024-12-20T00:01:00").toISOString(),
//       codType: "1234567890",
//       codAmount: 1234567890,
//       sender: "1234567890",
//       senderName: "1234567890",
//       senderAddressLine1: "1234567890",
//       senderAddressLine2: "1234567890",
//       senderZip: "1234567890",
//       senderPhoneNumber: "1234567890",
//       senderContactPerson: "1234567890",
//       orderNotes: "1234567890",
//       consigneeNum: "1234567890",
//       consigneeName: "1234567890",
//       addressLine1: "1234567890",
//       addressLine2: "1234567890",
//       zip: "1234567890",
//       phoneNumber: "1234567890",
//       contactPerson: "1234567890",
//       createdUserID: 1234567890,
//       createdDate: "2024-05-20T00:01:00",
//       lastTransferDate: "2024-05-20T00:01:00",
//       status: "1234567890",
//       qty: 1234567890,
//       templateID: 1234567890,
//       manifestDL: "1234567890",
//       manifestPk: "1234567890",

//       assignPK: 1234567890,
//       assignDL: 1234567890,
//       division: "1234567890",
//       lastEventComment: "1234567890",
//       reason: "1234567890",
//       barcode: "1234567890",
//       referenceNo: "1234567890",
//     },
//     {
//       companyID: "1234567890",
//       shipmentID: 123,
//       waybill: "1234567890",
//       serviceType: 1,
//       serviceTypeName: "Servicio",
//       packageType: 1,
//       readyDate: "2024-05-20T00:01:00",
//       dueDate: new Date().toISOString(),
//       codType: "1234567890",
//       codAmount: 1234567890,
//       sender: "1234567890",
//       senderName: "1234567890",
//       senderAddressLine1: "1234567890",
//       senderAddressLine2: "1234567890",
//       senderZip: "1234567890",
//       senderPhoneNumber: "1234567890",
//       senderContactPerson: "1234567890",
//       orderNotes: "1234567890",
//       consigneeNum: "1234567890",
//       consigneeName: "1234567890",
//       addressLine1: "1234567890",
//       addressLine2: "1234567890",
//       zip: "1234567890",
//       phoneNumber: "1234567890",
//       contactPerson: "1234567890",
//       createdUserID: 1234567890,
//       createdDate: "2024-05-20T00:01:00",
//       lastTransferDate: "2024-05-20T00:01:00",
//       status: "COMPLETED",
//       qty: 1234567890,
//       templateID: 1234567890,
//       manifestDL: "1234567890",
//       manifestPk: "1234567891",

//       assignPK: 1234567890,
//       assignDL: 1234567890,
//       division: "1234567890",
//       lastEventComment: "1234567890",
//       reason: "1234567890",
//       barcode: "1234567890",
//       referenceNo: "1234567890",
//     },
//   ])
//     .then((res) => {
//       console.log("INSERTED SHIPMENTS", res);
//     })
//     .catch((error) => {
//       console.log("ERROR SHIPMENTS", error);
//     });

//   insertMultiplePieces(db, [
//     {
//       pieceID: 123,
//       companyID: "1234567890",
//       shipmentID: 2,
//       barcode: "1234567890",
//       packageType: 1,
//       packageTypeName: "1234567890",
//       comments: "1234567890",
//       pwBack: "1234567890",
//       pod: "1234567890",
//     },
//     {
//       pieceID: 124,
//       companyID: "1234567890",
//       shipmentID: 2,
//       barcode: "1234567890",
//       packageType: 1,
//       packageTypeName: "1234567890",
//       comments: "1234567890",
//       pwBack: "1234567890",
//       pod: "1234567890",
//     },
//     {
//       pieceID: 125,
//       companyID: "1234567890",
//       shipmentID: 2,
//       barcode: "1234567890",
//       packageType: 1,
//       packageTypeName: "1234567890",
//       comments: "1234567890",
//       pwBack: "1234567890",
//       pod: "1234567890",
//     },
//   ])
//     .then((res) => {
//       console.log("INSERTED PIECES", res);
//     })
//     .catch((error) => {
//       console.log("ERROR PIECES", error);
//     });

//   insertMultipleComments(db, [
//     { shipmentID: 2, comment: "Comentario 1" },
//     { shipmentID: 2, comment: "Comentario 2" },
//     { shipmentID: 2, comment: "asdasd" },
//   ])
//     .then((res) => {
//       console.log("INSERTED COMMENTS", res);
//     })
//     .catch((error) => {
//       console.log("ERROR COMMENTS", error);
//     });

//   insertMultipleExceptions(db, [
//     {
//       reasonID: 3,
//       companyID: "10029",
//       customerID: 0,
//       reasonCode: "314",
//       reasonDesc: "PICKUP",
//       reasonCodeDesc: "314 - PICKUP",
//       completeOrder: false,
//     },
//     {
//       reasonID: 4,
//       companyID: "10029",
//       customerID: 0,
//       reasonCode: "314",
//       reasonDesc: "PICKUP",
//       reasonCodeDesc: "314 - PICKUP",
//       completeOrder: false,
//     },
//     {
//       reasonID: 2,
//       companyID: "10029",
//       customerID: 0,
//       reasonCode: "314",
//       reasonDesc: "PICKUP",
//       reasonCodeDesc: "314 - PICKUP",
//       completeOrder: false,
//     },
//     {
//       reasonID: 10,
//       companyID: "10029",
//       customerID: 0,
//       reasonCode: "314",
//       reasonDesc: "PICKUP",
//       reasonCodeDesc: "314 - PICKUP",
//       completeOrder: false,
//     },
//   ])
//     .then((res) => {
//       console.log("INSERTED EXCEPTIONS", res);
//     })
//     .catch((error) => {
//       console.log("ERROR EXCEPTIONS", error);
//     });
// }
