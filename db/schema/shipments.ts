import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const shipmentsTable = sqliteTable("shipments", {
  addressLine1: text(),
  addressLine2: text(),
  assignDL: integer(),
  assignPK: integer(),
  barcode: text(),
  city: text(),
  codAmount: real(),
  codType: text(),
  companyID: text().notNull(),
  consigneeName: text(),
  consigneeNum: text(),
  contactPerson: text(),
  createdDate: text(),
  createdUserID: integer(),
  division: text(),
  driverAssign: integer(),
  dueDate: text(),
  items: text(),
  lastEventComment: text(),
  lastTransferDate: text(),
  latitude: real(),
  longitude: real(),
  manifest: text().notNull(),
  manifestDL: text(),
  manifestPk: text(),
  orderNotes: text(),
  packageType: integer(),
  phoneNumber: text(),
  photoOnDelivery: integer({ mode: "boolean" }),
  photoOnEvent: integer({ mode: "boolean" }),
  qty: integer(),
  readyDate: text(),
  reason: text(),
  referenceNo: text(),
  sender: text(),
  senderAddressLine1: text(),
  senderAddressLine2: text(),
  senderContactPerson: text(),
  senderName: text(),
  senderPhoneNumber: text(),
  senderZip: text(),
  serviceType: integer(),
  serviceTypeName: text(),
  shipmentID: integer().primaryKey({ autoIncrement: true }),
  signatureOnDelivery: integer({ mode: "boolean" }),
  status: text().notNull(),
  templateID: integer(),
  waybill: text(),
  zip: text(),
  ...syncColumns,
});

export type TShipmentsData = typeof shipmentsTable.$inferSelect;
export type TShipmentInsertData = Omit<TShipmentsData, "isSync" | "lastSync">;

export type TShipmentListData = Pick<
  TShipmentsData,
  | "shipmentID"
  | "consigneeName"
  | "zip"
  | "senderName"
  | "serviceTypeName"
  | "addressLine1"
  | "addressLine2"
  | "referenceNo"
  | "dueDate"
  | "qty"
  | "city"
>;

export type TShipmentSearchData = Pick<
  TShipmentsData,
  | "shipmentID"
  | "consigneeName"
  | "zip"
  | "senderName"
  | "serviceTypeName"
  | "addressLine1"
  | "addressLine2"
  | "referenceNo"
  | "dueDate"
  | "qty"
  | "city"
>;
