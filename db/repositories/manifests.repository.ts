import { db } from "@/db";
import { manifestsTable, TManifestInsertData } from "../schema/manifests";
import { inArray } from "drizzle-orm";
class ManifestsRepository {
  private static instance: ManifestsRepository;

  constructor() {}

  static getInstance(): ManifestsRepository {
    if (!ManifestsRepository.instance) {
      ManifestsRepository.instance = new ManifestsRepository();
    }
    return ManifestsRepository.instance;
  }

  /** Inserts multiple manifests into the database */
  async insertMultiple(manifestsArr: TManifestInsertData[]) {
    try {
      const { noExisting } = await this.filterDuplicated(manifestsArr);
      if (noExisting.length === 0) return;

      await db.insert(manifestsTable).values(noExisting);
    } catch (error) {
      console.error("🚀 ~ insertMultiple ~ error:", error);
      throw error;
    }
  }

  /** Filters out manifests that already exist in the database
   * @param manifestsArr - Array of manifests to filter
   * @returns A promise that resolves to an object with two properties:
   *   - `noExisting`: An array of manifests that do not exist in the database.
   *   - `existing`: An array of manifests that already exist in the database.
   */
  async filterDuplicated(manifestsArr: TManifestInsertData[]) {
    try {
      const setIncomingIds = new Set(manifestsArr.map((v) => v.manifest));
      const existingInDB = await db
        .select()
        .from(manifestsTable)
        .where(inArray(manifestsTable.manifest, [...setIncomingIds]));

      const noExisting = manifestsArr.filter(
        (v) => !existingInDB.some((e) => e.manifest === v.manifest)
      );
      const existing = manifestsArr.filter((v) =>
        existingInDB.some((e) => e.manifest === v.manifest)
      );

      return { noExisting, existing };
    } catch (error) {
      console.error("🚀 ~ filterDuplicatedManifests ~ error:", error);
      throw error;
    }
  }

  /** Deletes all rows in the manifests table */
  async deleteAll() {
    try {
      return await db.delete(manifestsTable);
    } catch (error) {
      console.error("🚀 ~ deleteAll ~ error:", error);
      throw error;
    }
  }
}

export type TManifestsRepository = ManifestsRepository;
export const ManifestsLocalService = ManifestsRepository.getInstance();
