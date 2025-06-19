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
      const { notExistingIds } = await this.filterDuplicatedCODS(cods);

      if (notExistingIds.length > 0) {
        await db
          .insert(codTable)
          .values(cods.filter((v) => notExistingIds.includes(v.codTypeID)));
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
   *   - `existingIds`: An array of COD type IDs that already exist in the database.
   *   - `notExistingIds`: An array of COD type IDs that do not exist in the database.
   * @throws Rejects the promise with an error if there's a problem accessing the database.
   */
  async filterDuplicatedCODS(codArr: TCODData[]): Promise<{
    existingIds: number[];
    notExistingIds: number[];
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
      const existingSet = new Set(existing.map((e) => e.codTypeID));
      const notExistingIds = [...incomingIds].filter(
        (id) => !existingSet.has(id)
      );

      return {
        existingIds: Array.from(existingSet),
        notExistingIds,
      };
    } catch (error) {
      console.error("🚀 ~ filterDuplicatedCODS ~ error:", error);
      throw error;
    }
  }

  /** Deletes all rows in the cod table */
  async deleteAllCods() {
    try {
      await db.delete(codTable);
    } catch (error) {
      console.error("🚀 ~ deleteAllCods ~ error:", error);
      throw error;
    }
  }
}

export type ICODRepository = CODRepository;
// Export the singleton instance
export const CodRepository = CODRepository.getInstance();
