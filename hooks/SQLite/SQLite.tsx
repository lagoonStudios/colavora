import { useEffect } from "react";
import * as SQLite from "expo-sqlite";

import { createAllDBTables } from "./SQLite.functions";
import { insertComments } from "./comments.local.queries";

const DB_NAME = "test.db";
export const db = SQLite.openDatabaseSync(DB_NAME);

export default function useSQLite() {
  useEffect(() => {
    console.log("Starting SQLite");
    try {
      createAllDBTables(db);
      insertComments([
        { shipmentId: 2, comment: "Comentario 1" },
        { shipmentId: 6, comment: "Comentario 2" },
        { shipmentId: 7, comment: "Testesasdasdasdasdasd" },
      ]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return;
}
