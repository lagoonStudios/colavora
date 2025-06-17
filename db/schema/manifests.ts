import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const manifestsTable = sqliteTable("manifests", {
  manifest: text().primaryKey(),
  companyID: text().notNull(),
  driverID: integer(),
  createdDate: text(),
  ...syncColumns,
});

export type TManifestsData = typeof manifestsTable.$inferSelect;
