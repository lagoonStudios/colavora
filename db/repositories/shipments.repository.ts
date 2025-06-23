import {
  and,
  countDistinct,
  eq,
  ilike,
  inArray,
  isNotNull,
  lte,
  not,
  notInArray,
  or,
} from "drizzle-orm";
import {
  shipmentsTable,
  TShipmentInsertData,
  TShipmentListData,
  TShipmentsData,
  TShipmentSearchData,
} from "../schema/shipments";
import { db } from "@/db";
import { ShipmentStatus } from "@constants/types/shipments";
import { piecesTable } from "../schema/pieces";

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
  async insertMultiple(shipmentsArr: TShipmentInsertData[]): Promise<void> {
    try {
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
          manifestDL: v.manifest,
          assignPK: v.assignPK,
          assignDL: v.assignDL,
          division: v.division,
          lastEventComment: v.lastEventComment,
          reason: v.reason,
          barcode: v.barcode,
          referenceNo: v.referenceNo,
          manifestPk: v.manifest,
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
  async filterDuplicated(shipmentsArr: TShipmentInsertData[]): Promise<{
    noExisting: TShipmentInsertData[];
    existing: TShipmentInsertData[];
  }> {
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

  /** Gets the count and completed count of shipments for the current day. */
  async getTodayShipments(): Promise<{ count: number }> {
    try {
      const endToday = new Date();
      endToday.setHours(23, 59, 59, 999);
      const shipments = await db
        .select({
          count: countDistinct(shipmentsTable.shipmentID),
        })
        .from(shipmentsTable)
        .where(
          and(
            isNotNull(shipmentsTable.status),
            not(
              inArray(shipmentsTable.status, [
                ShipmentStatus.COMPLETED,
                ShipmentStatus.CANCELLED,
                ShipmentStatus.PARTIAL_DELIVERY,
                ShipmentStatus.DELIVERED,
              ])
            ),
            lte(shipmentsTable.dueDate, endToday.toISOString())
          )
        );
      return { count: shipments[0]?.count ?? 0 };
    } catch (error) {
      console.error("🚀 ~ getTodayShipments ~ error:", error);
      throw error;
    }
  }

  /**
   * Retrieves an array of shipment list items associated with a specific manifest ID from the database.
   * @param params - An object containing the manifest ID.
   * @returns A Promise that resolves to an array of TShipmentListData objects.
   * @see {@link TShipmentListData}
   */
  async getShipmentList({
    manifestID,
  }: {
    manifestID?: number;
  }): Promise<TShipmentListData[]> {
    try {
      const baseQuery = db
        .select({
          shipmentID: shipmentsTable.shipmentID,
          consigneeName: shipmentsTable.consigneeName,
          zip: shipmentsTable.zip,
          senderName: shipmentsTable.senderName,
          serviceTypeName: shipmentsTable.serviceTypeName,
          addressLine1: shipmentsTable.addressLine1,
          addressLine2: shipmentsTable.addressLine2,
          referenceNo: shipmentsTable.referenceNo,
          dueDate: shipmentsTable.dueDate,
          qty: shipmentsTable.qty,
          city: shipmentsTable.city,
        })
        .from(shipmentsTable)
        .where(
          and(
            isNotNull(shipmentsTable.status),
            notInArray(shipmentsTable.status, [
              ShipmentStatus.COMPLETED,
              ShipmentStatus.CANCELLED,
              ShipmentStatus.PARTIAL_DELIVERY,
              ShipmentStatus.DELIVERED,
            ])
          )
        )
        .$dynamic();

      if (manifestID) {
        const result = await baseQuery.where(
          or(
            eq(shipmentsTable.manifest, manifestID),
            eq(shipmentsTable.manifestDL, manifestID),
            eq(shipmentsTable.manifestPk, manifestID)
          )
        );

        return result;
      } else {
        const result = await baseQuery;
        return result;
      }
    } catch (error) {
      console.error("🚀 ~ getShipmentList ~ error:", error);
      throw error; // Re-throw the error to maintain the same behavior as the original
    }
  }

  /**
   * Retrieves shipment details by shipment ID from the SQLite database.
   * @param params - An object containing the shipment ID.
   * @returns A Promise that resolves to a partial object of TShipmentsData, or rejects with an error.
   * @see {@link TShipmentsData}
   */
  async getShipmenDetailsById({
    shipmentID,
  }: {
    shipmentID: number;
  }): Promise<TShipmentsData & { invoiceBarcode: string }> {
    try {
      const result = await db
        .select()
        .from(shipmentsTable)
        .leftJoin(
          piecesTable,
          and(
            eq(shipmentsTable.shipmentID, piecesTable.shipmentID),
            eq(piecesTable.packageTypeName, "Invoice")
          )
        )
        .where(eq(shipmentsTable.shipmentID, shipmentID));

      if (!result.length) {
        throw new Error("Shipment not found");
      }

      const shipment = result[0].shipments;
      const invoiceBarcode = result[0]?.pieces?.barcode || "";

      return { ...shipment, invoiceBarcode };
    } catch (error) {
      console.error("🚀 ~ getShipmenDetailsById ~ error:", error);
      throw error;
    }
  }

  /** Updates the status of a shipment in the database.
   * @param params - An object containing the shipment ID, status, and isSync.
   * @returns A Promise that resolves with a success message if the update is successful, or rejects with an error message if the update fails.
   */
  async updateShipmentStatus({
    shipmentId,
    status,
    isSync,
  }: {
    shipmentId: number;
    status: ShipmentStatus;
    isSync?: boolean;
  }): Promise<string> {
    try {
      await db
        .update(shipmentsTable)
        .set({ status, isSync: isSync || false })
        .where(eq(shipmentsTable.shipmentID, shipmentId));
      return "Shipment status updated successfully";
    } catch (error) {
      console.error("🚀 ~ updateShipmentStatus ~ error:", error);
      throw error;
    }
  }

  /**
   * Retrieves all the shipment IDs from the 'shipments' table where manifest match with the given one.
   * @returns A promise that resolves to an array of shipments IDs.
   */
  async getAllShipmentIds({
    manifestID,
  }: {
    manifestID?: number;
  }): Promise<{ shipmentIds: number[] }> {
    try {
      const result = await db
        .select()
        .from(shipmentsTable)
        .where(
          manifestID ? eq(shipmentsTable.manifest, manifestID) : undefined
        );
      const shipmentIds = result.map((v) => v.shipmentID);
      return { shipmentIds };
    } catch (error) {
      console.error("🚀 ~ getAllShipmentIds ~ error:", error);
      throw error;
    }
  }

  async searchShipments({ q }: { q: string }): Promise<TShipmentSearchData[]> {
    try {
      const shipmentsSearchQuery = await db
        .select({
          shipmentID: shipmentsTable.shipmentID,
          consigneeName: shipmentsTable.consigneeName,
          zip: shipmentsTable.zip,
          senderName: shipmentsTable.senderName,
          serviceTypeName: shipmentsTable.serviceTypeName,
          addressLine1: shipmentsTable.addressLine1,
          addressLine2: shipmentsTable.addressLine2,
          referenceNo: shipmentsTable.referenceNo,
          qty: shipmentsTable.qty,
          city: shipmentsTable.city,
          dueDate: shipmentsTable.dueDate,
        })
        .from(shipmentsTable)
        .where(
          or(
            ilike(shipmentsTable.consigneeName, `%${q}%`),
            ilike(shipmentsTable.referenceNo, `%${q}%`),
            ilike(shipmentsTable.waybill, `%${q}%`),
            ilike(shipmentsTable.serviceTypeName, `%${q}%`),
            ilike(shipmentsTable.codType, `%${q}%`),
            ilike(shipmentsTable.sender, `%${q}%`),
            ilike(shipmentsTable.senderName, `%${q}%`),
            ilike(shipmentsTable.addressLine1, `%${q}%`),
            ilike(shipmentsTable.addressLine2, `%${q}%`),
            ilike(shipmentsTable.contactPerson, `%${q}%`),
            ilike(shipmentsTable.barcode, `%${q}%`),
            ilike(shipmentsTable.city, `%${q}%`),
            ilike(shipmentsTable.zip, `%${q}%`),
            ilike(shipmentsTable.phoneNumber, `%${q}%`)
          )
        );

      // Second query - search in pieces table and join with shipments
      const pieceSearchQuery = db
        .select({
          shipmentID: shipmentsTable.shipmentID,
          consigneeName: shipmentsTable.consigneeName,
          zip: shipmentsTable.zip,
          senderName: shipmentsTable.senderName,
          serviceTypeName: shipmentsTable.serviceTypeName,
          addressLine1: shipmentsTable.addressLine1,
          addressLine2: shipmentsTable.addressLine2,
          referenceNo: shipmentsTable.referenceNo,
          qty: shipmentsTable.qty,
          city: shipmentsTable.city,
          dueDate: shipmentsTable.dueDate,
          pieceBarcode: piecesTable.barcode,
        })
        .from(shipmentsTable)
        .innerJoin(
          piecesTable,
          eq(piecesTable.shipmentID, shipmentsTable.shipmentID)
        )
        .where(ilike(piecesTable.barcode, `%${q}%`));

      const [shipments, pieces] = await Promise.all([
        shipmentsSearchQuery,
        pieceSearchQuery,
      ]);

      if (!shipments || !pieces) {
        return [];
      }

      const shipmentsMap = new Map<string, TShipmentSearchData>();

      shipments.forEach((shipment) => {
        if (shipment.shipmentID) {
          shipmentsMap.set(`${shipment.shipmentID}`, shipment);
        }
      });

      pieces.forEach((piece) => {
        if (piece.shipmentID) {
          shipmentsMap.set(`${piece.shipmentID}`, piece);
        }
      });

      return Array.from(shipmentsMap.values());
    } catch (error) {
      console.error("🚀 ~ searchShipments ~ error:", error);
      throw error;
    }
  }

  async deleteAll() {
    try {
      await db.delete(shipmentsTable);
    } catch (error) {
      console.error("🚀 ~ deleteAll ~ error:", error);
      throw error;
    }
  }

  async updateShipmentException({
    shipmentID,
    isSync,
    reasonCode,
  }: {
    shipmentID: number;
    isSync: boolean;
    reasonCode: string;
  }): Promise<{ message: string; changes: number }> {
    try {
      const res = await db
        .update(shipmentsTable)
        .set({ isSync, reason: reasonCode })
        .where(eq(shipmentsTable.shipmentID, shipmentID));

      return { message: "Shipment updated successfully", changes: res.changes };
    } catch (error) {
      console.error("🚀 ~ updateShipmentException ~ error:", error);
      throw error;
    }
  }

  async deleteShipment({ shipmentID }: { shipmentID: number }) {
    try {
      const res = await db
        .delete(shipmentsTable)
        .where(eq(shipmentsTable.shipmentID, shipmentID));

      if (res.changes === 0) {
        throw new Error("Shipment not found");
      }

      return { message: "Shipment deleted successfully", changes: res.changes };
    } catch (error) {
      console.error("🚀 ~ deleteShipment ~ error:", error);
      throw error;
    }
  }
}
export type TShipmentRepository = ShipmentRepository;
export const ShipmentLocalService = ShipmentRepository.getInstance();
