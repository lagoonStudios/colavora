import { db } from "@/db";
import { exceptionsTable, TExceptionsInsertData } from "../schema/exceptions";
import { inArray, eq, or } from "drizzle-orm";
import { Language } from "@constants/types/general";

class ExceptionRepository {
  private static instance: ExceptionRepository;
  private constructor() {}

  static getInstance(): ExceptionRepository {
    if (!ExceptionRepository.instance) {
      ExceptionRepository.instance = new ExceptionRepository();
    }
    return ExceptionRepository.instance;
  }

  /** Inserts multiple exceptions into the database */
  async insertMultiple(exceptionsArr: TExceptionsInsertData[]) {
    try {
      const { notExisting } = await this.filterDuplicated(exceptionsArr);

      if (notExisting.length === 0) return;

      await db.insert(exceptionsTable).values(
        notExisting.map((v) => ({
          lang: v.lang,
          reasonID: v.reasonID,
          companyID: v.companyID,
          customerID: v.customerID,
          reasonCode: v.reasonCode,
          reasonDesc: v.reasonDesc,
          completeOrder: v.completeOrder,
        }))
      );
    } catch (error) {
      console.error("🚀 ~ insertMultiple ~ error:", error);
      throw error;
    }
  }

  /** Filters out exceptions that already exist in the database
   * @param exceptionsArr - Array of exceptions to filter
   * @returns A promise that resolves to an object with two properties:
   *   - `existing`: An array of exception IDs that already exist in the database.
   *   - `notExisting`: An array of exception IDs that do not exist in the database.
   */
  async filterDuplicated(exceptionsArr: TExceptionsInsertData[]): Promise<{
    existing: TExceptionsInsertData[];
    notExisting: TExceptionsInsertData[];
  }> {
    try {
      const setIncomingIds = new Set(exceptionsArr.map((v) => v.reasonID));
      const existingFromDB = await db
        .select()
        .from(exceptionsTable)
        .where(inArray(exceptionsTable.reasonID, [...setIncomingIds]));

      const notExisting = exceptionsArr.filter(
        (v) => !existing.some((e) => e.reasonID === v.reasonID)
      );
      const existing = exceptionsArr.filter((v) =>
        existingFromDB.some((e) => e.reasonID === v.reasonID)
      );

      return { notExisting, existing };
    } catch (error) {
      console.error("🚀 ~ filterDuplicatedExceptions ~ error:", error);
      throw error;
    }
  }

  async getAll(params: { lang: Language }) {
    try {
      const { lang } = params;
      return await db
        .select()
        .from(exceptionsTable)
        .where(
          or(eq(exceptionsTable.lang, lang), eq(exceptionsTable.lang, "en"))
        );
    } catch (error) {
      console.error("🚀 ~ getAll ~ error:", error);
      throw error;
    }
  }

  /** Deletes all rows in the exceptions table */
  async deleteAll() {
    try {
      return await db.delete(exceptionsTable);
    } catch (error) {
      console.error("🚀 ~ deleteAll ~ error:", error);
      throw error;
    }
  }
}

export type TExceptionRepository = ExceptionRepository;
export const ExceptionLocalService = ExceptionRepository.getInstance();
