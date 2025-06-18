import { db } from "@/db";
import { codTable, TCODData } from "../schema/cod";
import { inArray } from "drizzle-orm";

export async function insertMultipleCOD(codArr: TCODData[]) {
  try {
    const { existingIds, notExistingIds } = await filterDuplicatedCODS(codArr);
    if (notExistingIds.length > 0) {
      await db
        .insert(codTable)
        .values(codArr.filter((v) => notExistingIds.includes(v.codTypeID)));
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
export async function filterDuplicatedCODS(codArr: TCODData[]): Promise<{
  existingIds: number[];
  notExistingIds: number[];
}> {
  try {
    // First, create a map of all incoming CODs to remove duplicates
    const codMap = new Map<number, TCODData>();
    codArr.forEach((v) => codMap.set(v.codTypeID, v));
    const cods = [...codMap.values()];

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
