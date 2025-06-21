import { db } from "@/db";
import { manifestsTable, TManifestInsertData } from "../schema/manifests";
import {
  and,
  count,
  countDistinct,
  eq,
  gt,
  inArray,
  isNotNull,
  not,
  or,
  desc,
} from "drizzle-orm";
import { ShipmentStatus } from "@constants/types/shipments";
import { shipmentsTable } from "../schema/shipments";
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

      await db.insert(manifestsTable).values(
        noExisting.map((v) => ({
          manifest: v.manifest,
          driverID: v.driverID,
          manifestDate: v.manifestDate,
          manifestId: v.manifestId,
          manifestType: v.manifestType,
        }))
      );
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

  async getManifestsList(): Promise<{
    value: {
      manifest: number;
      createdDate: string | null;
      active_shipments: number;
    }[];
  }> {
    try {
      const manifestsWithActiveShipments = await db
        .select({
          manifest: manifestsTable.manifest,
          createdDate: manifestsTable.manifestDate,
          active_shipments: count(
            and(
              isNotNull(shipmentsTable.status),
              not(
                inArray(shipmentsTable.status, [
                  ShipmentStatus.COMPLETED,
                  ShipmentStatus.CANCELLED,
                  ShipmentStatus.PARTIAL_DELIVERY,
                  ShipmentStatus.DELIVERED,
                ])
              )
            )
          ).as("active_shipments"),
        })
        .from(manifestsTable)
        .innerJoin(
          shipmentsTable,
          eq(manifestsTable.manifest, shipmentsTable.manifest)
        )
        .groupBy(manifestsTable.manifest, manifestsTable.manifestDate)
        .orderBy(desc(manifestsTable.manifestDate));

      return { value: manifestsWithActiveShipments };
    } catch (error) {
      console.error("🚀 ~ getAll ~ error:", error);
      throw error;
    }
  }

  /** Returns the count of all rows in the manifests table that has not completed or canceled manifests. */
  async getCount(): Promise<{ count: number }> {
    try {
      const result = await db
        .select({
          count: countDistinct(manifestsTable.manifest),
          shipment_count: countDistinct(shipmentsTable.shipmentID),
        })
        .from(manifestsTable)
        .innerJoin(
          shipmentsTable,
          or(
            eq(manifestsTable.manifest, shipmentsTable.manifestPk),
            eq(manifestsTable.manifest, shipmentsTable.manifestDL)
          )
        )
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
            )
          )
        )
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .having(({ shipment_count }) => gt(shipment_count, 0));

      return { count: result[0]?.count ?? 0 };
    } catch (error) {
      console.error("🚀 ~ getCount ~ error:", error);
      throw error;
    }
  }

  async getAllManifestIds(): Promise<{ manifestIds: number[] }> {
    try {
      const result = await db
        .select({ manifest: manifestsTable.manifest })
        .from(manifestsTable);
      return { manifestIds: result.map(({ manifest }) => manifest) };
    } catch (error) {
      console.error("🚀 ~ getAllManifestIds ~ error:", error);
      throw error;
    }
  }
}

export type TManifestsRepository = ManifestsRepository;
export const ManifestsLocalService = ManifestsRepository.getInstance();
