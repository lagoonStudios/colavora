import { useEffect } from "react";
import * as SQLite from "expo-sqlite";

import { createAllDBTables } from "./SQLite.functions";

const DB_NAME = "test.db";
export const db = SQLite.openDatabaseSync(DB_NAME);

export default function useSQLite() {
  useEffect(() => {
    console.log("Starting SQLite");
    try {
      createAllDBTables(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return;
}
