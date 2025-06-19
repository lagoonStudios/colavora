import { db } from "@/db";
import { codTable, TCODData } from "../schema/cod";
import { inArray } from "drizzle-orm";

class CODRepository {
  private static instance: CODRepository;
  private constructor() {}

  static getInstance(): CODRepository {
    if (!CODRepository.instance) {
      CODRepository.instance = new CODRepository();
    }
    return CODRepository.instance;
  }

  /**
   * Asynchronously inserts multiple CODs into the database.
   * @param cods array of cods to insert
   */
  async insertMultiple(cods: TCODData[]): Promise<void> {
    try {
      const { notExisting } = await this.filterDuplicated(cods);

      if (notExisting.length > 0) {
        await db.insert(codTable).values(
          notExisting.map((c) => ({
            companyID: c.companyID,
            lang: c.lang,
            codTypeID: c.codTypeID,
            codType: c.codType,
          }))
        );
        return;
      }
    } catch (error) {
      console.error("🚀 ~ insertMultipleCOD ~ error:", error);
      throw error;
    }
  }

  /**
   * Asynchronously filters out COD type IDs from the provided `cods` array that already exist in the database.
   *
   * @param  codArr - An array of objects representing COD data, each containing a `codTypeID` property.
   * @returns A promise that resolves to an object with two properties:
   *   - `existing`: An array of COD that already exist in the database.
   *   - `notExisting`: An array of COD that do not exist in the database.
   * @throws Rejects the promise with an error if there's a problem accessing the database.
   */
  async filterDuplicated(codArr: TCODData[]): Promise<{
    existing: TCODData[];
    notExisting: TCODData[];
  }> {
    try {
      // First, create a map of all incoming CODs to remove duplicates
      const codMap = new Map<number, TCODData>();
      codArr.forEach((v) => codMap.set(v.codTypeID, v));

      // Get all unique IDs from the input
      const incomingIds = [...codMap.keys()];

      // Query the database for existing IDs
      const existing = await db
        .select()
        .from(codTable)
        .where(inArray(codTable.codTypeID, incomingIds));

      // Create sets of existing and not existing IDs
      const existingSet = codArr.filter((v) =>
        existing.some((e) => e.codTypeID === v.codTypeID)
      );
      const notExisting = codArr.filter(
        (id) => !existingSet.some((e) => e.codTypeID === id.codTypeID)
      );

      return {
        existing: existingSet,
        notExisting,
      };
    } catch (error) {
      console.error("🚀 ~ filterDuplicatedCODS ~ error:", error);
      throw error;
    }
  }

  /** Deletes all rows in the cod table */
  async deleteAll() {
    try {
      await db.delete(codTable);
    } catch (error) {
      console.error("🚀 ~ deleteAllCods ~ error:", error);
      throw error;
    }
  }
}

export type TCODRepository = CODRepository;
// Export the singleton instance
export const CODLocalService = CODRepository.getInstance();
