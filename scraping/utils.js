import * as cheerio from "cheerio";

import { TEAMS, writeDBFile } from "../db/index.js";
import { getLeaderBoard } from "./leaderboard.js";
import { logError, logInfo, logSuccess } from "./log.js";
import { getMvpPlayers } from "./mvp.js";

export const SCRAPINGS = {
  leaderboard: {
    url: "https://kingsleague.pro/clasificacion/",
    scraper: getLeaderBoard,
  },
  mvp: {
    url: "https://kingsleague.pro/estadisticas/mvp/",
    scraper: getMvpPlayers,
  },
};

export async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

export function getImageFromTeam({ name }) {
  const { image } = TEAMS.find((team) => team.name === name);
  return image;
}

export async function scrapeAndSave(file) {
  const start = performance.now();
  try {
    const { url, scraper } = SCRAPINGS[file];
    logInfo(`Scraping ${[file]}`);
    const $ = await scrape(url);
    const resultScraping = await scraper($);

    logSuccess(`${[file]} Scraped succsesfuly`);
    logInfo(`Writing ${[file]} to DB`);

    await writeDBFile(file, resultScraping);

    logSuccess(`${[file]} written successfully`);
  } catch (error) {
    logError(`Error scraping ${[file]}`);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`${[file]} scraped in ${time} seconds`);
  }
}