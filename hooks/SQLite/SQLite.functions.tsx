import * as SQLite from "expo-sqlite";

export async function createTestTable(db: SQLite.SQLiteDatabase) {
  try {
    db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);
      INSERT INTO test (name, age) VALUES ('John', 30);
      INSERT INTO test (name, age) VALUES ('Jane', 25);
      INSERT INTO test (name, age) VALUES ('Bob', 35);
      `
    );
    console.log("table created");

    const firstRow = await db.getAllAsync("SELECT * FROM test");
    console.log(firstRow);
  } catch (error) {
    console.error(error);
  }
}

export async function createCompanyTable(db: SQLite.SQLiteDatabase) {
  try {
    // await db.execAsync(
    //   `
    //   CREATE TABLE IF NOT EXISTS companies (
    //     companyID VARCHAR(10) PRIMARY KEY,
    //     companyName VARCHAR(100) NOT NULL,
    //     logo TEXT,
    //     slogan TEXT,
    //     tel1 TEXT,
    //     ext TEXT,
    //     tel2 TEXT,
    //     address1 TEXT,
    //     address2 TEXT,
    //     city TEXT,
    //     state TEXT,
    //     zip VARCHAR(10),
    //     contact TEXT,
    //     position TEXT,
    //     contactEmail TEXT,
    //     companyEmail TEXT
    //   );
    //   CREATE INDEX idx_companyID ON companies (companyID);
    //   `
    // );
  } catch (error) {
    console.error(error);
  }
}

export function createAllDBTables(db: SQLite.SQLiteDatabase) {
  createCompanyTable(db);
}
