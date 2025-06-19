import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const manifestsTable = sqliteTable("manifests", {
  manifest: text().primaryKey(),
  companyID: text(),
  driverID: integer(),
  manifestDate: text(),
  manifestId: text(),
  manifestType: text(),
  ...syncColumns,
});

export type TManifestsData = typeof manifestsTable.$inferSelect;
export type TManifestInsertData = Omit<TManifestsData, "isSync" | "lastSync">;
