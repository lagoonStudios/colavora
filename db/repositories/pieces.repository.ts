import { piecesTable, TPiecesInsertData } from "../schema/pieces";
import { db } from "@/db";
import { inArray, eq } from "drizzle-orm";

export class PiecesRepository {
  private static instance: PiecesRepository;

  constructor() {}

  static getInstance(): PiecesRepository {
    if (!PiecesRepository.instance) {
      PiecesRepository.instance = new PiecesRepository();
    }
    return PiecesRepository.instance;
  }

  /** Inserts multiple pieces into the database */
  async insertMultiple(piecesArr: TPiecesInsertData[]) {
    try {
      const { noExisting } = await this.filterDuplicated(piecesArr);
      if (noExisting.length === 0) return;

      await db.insert(piecesTable).values(
        noExisting.map((v) => ({
          pieceID: v.pieceID,
          companyID: v.companyID,
          barcode: v.barcode,
          packageType: v.packageType,
          packageTypeName: v.packageTypeName,
          comments: v.comments,
          pwBack: v.pwBack,
          pod: v.pod,
          shipmentID: v.shipmentID,
        }))
      );
      return;
    } catch (error) {
      console.error("🚀 ~ insertMultipleCOD ~ error:", error);
      throw error;
    }
  }

  /** Filters out pieces that already exist in the database
   * @param piecesArr - Array of pieces to filter
   * @returns A promise that resolves to an object with two properties:
   *   - `existing`: An array of pieces that already exist in the database.
   *   - `notExisting`: An array of pieces that do not exist in the database.
   */
  async filterDuplicated(piecesArr: TPiecesInsertData[]): Promise<{
    existing: TPiecesInsertData[];
    noExisting: TPiecesInsertData[];
  }> {
    try {
      const mapPieces: Map<number, TPiecesInsertData> = new Map();

      for (const piece of piecesArr) {
        if (mapPieces.has(piece?.pieceID) === false)
          mapPieces.set(piece?.pieceID, piece);
      }
      const incomingIds = Array.from(mapPieces.keys()).filter(
        (id) => id != null
      );
      const existingInDB = await db
        .select()
        .from(piecesTable)
        .where(inArray(piecesTable.pieceID, [...incomingIds]));

      const noExisting = piecesArr.filter(
        (v) => !existingInDB.some((e) => e.pieceID === v.pieceID)
      );
      const existing = piecesArr.filter((v) =>
        existingInDB.some((e) => e.pieceID === v.pieceID)
      );

      return { noExisting, existing };
    } catch (error) {
      console.error("🚀 ~ filterDuplicated ~ error:", error);
      throw error;
    }
  }

  /** Deletes all rows in the pieces table */
  async deleteAll() {
    try {
      return await db.delete(piecesTable);
    } catch (error) {
      console.error("🚀 ~ deleteAll ~ error:", error);
      throw error;
    }
  }

  async getAllByShipmentID(shipmentID: number) {
    try {
      return await db
        .select()
        .from(piecesTable)
        .where(eq(piecesTable.shipmentID, shipmentID));
    } catch (error) {
      console.error("🚀 ~ getAllByShipmentID ~ error:", error);
      throw error;
    }
  }
}

export type IPiecesLocalService = PiecesRepository;
export const PiecesLocalService = PiecesRepository.getInstance();
