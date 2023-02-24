import { scrapeAndSave, SCRAPINGS } from "./utils.js";

for (const key in SCRAPINGS) {
  await scrapeAndSave(key);
}
