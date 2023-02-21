import { writeFile } from "node:fs/promises";
import teams from "../db/teams.json" assert { type: "json" };
import presidents from "../db/presidents.json" assert { type: "json" };

export const TEAMS = teams;
export const PRESIDENTS = presidents;

export const writeDBFile = (fileName, data) =>
  writeFile(fileName, JSON.stringify(data, null, 2), "utf-8");
