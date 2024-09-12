import { useEffect } from "react";
import { createAllDBTables } from "./queries/general.local.queries";

export default function useSQLite() {
  useEffect(() => {
    try {
      createAllDBTables().then((res) => {
        console.info(res);
      });
    } catch (error) {
      console.error("🚀 ~  useSQLite ~ error:", error);
    }
  }, []);

  return;
}
