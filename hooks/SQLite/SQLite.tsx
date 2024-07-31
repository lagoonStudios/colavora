import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { createAllDBTables } from "./SQLite.functions";
const DB_NAME = "test.db";

export default function useSQLite() {
  const db = SQLite.openDatabaseSync(DB_NAME);

  const startDB = () => {
    try {
      createAllDBTables(db);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("Starting SQLite");
    startDB();
  }, []);

  return;
}
