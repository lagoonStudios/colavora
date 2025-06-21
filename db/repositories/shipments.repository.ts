import { inArray } from "drizzle-orm";
import { shipmentsTable, TShipmentInsertData } from "../schema/shipments";
import { db } from "@/db";

class ShipmentRepository {
  private static instance: ShipmentRepository;
  private constructor() {}

  public static getInstance(): ShipmentRepository {
    if (!ShipmentRepository.instance) {
      ShipmentRepository.instance = new ShipmentRepository();
    }
    return ShipmentRepository.instance;
  }

  /**
   * Inserts multiple shipments into the database
   * @param shipmentsArr - Array of shipments to insert
   */
  async insertMultiple(shipmentsArr: TShipmentInsertData[]) {
    try {
      console.log("Inserting multiple shipments: ", shipmentsArr);
      const { noExisting } = await this.filterDuplicated(shipmentsArr);
      if (noExisting.length === 0) return;

      await db.insert(shipmentsTable).values(
        noExisting.map((v) => ({
          shipmentID: v.shipmentID,
          companyID: v.companyID,
          waybill: v.waybill,
          serviceType: v.serviceType,
          serviceTypeName: v.serviceTypeName,
          packageType: v.packageType,
          readyDate: v.readyDate,
          dueDate: v.dueDate,
          codType: v.codType,
          codAmount: v.codAmount,
          sender: v.sender,
          senderName: v.senderName,
          senderAddressLine1: v.senderAddressLine1,
          senderAddressLine2: v.senderAddressLine2,
          senderZip: v.senderZip,
          senderPhoneNumber: v.senderPhoneNumber,
          senderContactPerson: v.senderContactPerson,
          orderNotes: v.orderNotes,
          consigneeNum: v.consigneeNum,
          consigneeName: v.consigneeName,
          addressLine1: v.addressLine1,
          addressLine2: v.addressLine2,
          zip: v.zip,
          phoneNumber: v.phoneNumber,
          contactPerson: v.contactPerson,
          createdUserID: v.createdUserID,
          createdDate: v.createdDate,
          lastTransferDate: v.lastTransferDate,
          status: v.status,
          qty: v.qty,
          items: v.items,
          templateID: v.templateID,
          manifestDL: v.manifestDL,
          assignPK: v.assignPK,
          assignDL: v.assignDL,
          division: v.division,
          lastEventComment: v.lastEventComment,
          reason: v.reason,
          barcode: v.barcode,
          referenceNo: v.referenceNo,
          manifestPk: v.manifestPk,
          manifest: v.manifest,
          latitude: v.latitude,
          longitude: v.longitude,
          city: v.city,
          photoOnEvent: v.photoOnEvent,
          photoOnDelivery: v.photoOnDelivery,
          signatureOnDelivery: v.signatureOnDelivery,
          driverAssign: v.driverAssign,
        }))
      );
      return;
    } catch (error) {
      console.error("🚀 ~ insertMultiple ~ error:", error);
      throw error;
    }
  }

  /**
   * Filters out shipments that already exist in the database
   * @param shipmentsArr - Array of shipments to filter
   * @returns A promise that resolves to an object with two properties:
   *   - `noExisting`: An array of shipments that do not exist in the database.
   *   - `existing`: An array of shipments that already exist in the database.
   */
  async filterDuplicated(shipmentsArr: TShipmentInsertData[]) {
    try {
      const setIncomingIds = new Set(shipmentsArr.map((v) => v.shipmentID));
      const existingInDB = await db
        .select()
        .from(shipmentsTable)
        .where(inArray(shipmentsTable.shipmentID, [...setIncomingIds]));

      const noExisting = shipmentsArr.filter(
        (v) => !existingInDB.some((e) => e.shipmentID === v.shipmentID)
      );
      const existing = shipmentsArr.filter((v) =>
        existingInDB.some((e) => e.shipmentID === v.shipmentID)
      );

      return { noExisting, existing };
    } catch (error) {
      console.error("🚀 ~ filterDuplicated ~ error:", error);
      throw error;
    }
  }
}

export type TShipmentRepository = ShipmentRepository;
export const ShipmentLocalService = ShipmentRepository.getInstance();
