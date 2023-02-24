import { writeFile, readFile } from "node:fs/promises";
import teams from "../db/teams.json" assert { type: "json" };
import presidents from "../db/presidents.json" assert { type: "json" };
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "./db/");

export function readDBFile(dbName) {
  return readFile(`${DB_PATH}/${dbName}.json`, "utf-8").then(JSON.parse);
}

export const TEAMS = teams;
export const PRESIDENTS = presidents;

export const writeDBFile = (fileName, data) =>
  writeFile(
    `${DB_PATH}/${fileName}.json`,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
