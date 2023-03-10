import * as cheerio from "cheerio";

import { TEAMS, writeDBFile } from "../db/index.js";
// import { getCoaches } from "./coaches.js";
import { getLeaderBoard } from "./leaderboard.js";
import { logError, logInfo, logSuccess } from "./log.js";
import { getMvpPlayers } from "./mvp.js";
import { getPlayersTwelve } from "./players-twelve.js";
import { getAssists } from "./top_assists.js";
import { getTopScoresList } from "./top_scorer.js";
import { getTopStatistics } from "./top_stadistics.js";

export const SCRAPINGS = {
  leaderboard: {
    url: "https://kingsleague.pro/clasificacion/",
    scraper: getLeaderBoard,
  },
  mvp: {
    url: "https://kingsleague.pro/estadisticas/mvp/",
    scraper: getMvpPlayers,
  },
  top_scorers: {
    url: "https://kingsleague.pro/estadisticas/goles/",
    scraper: getTopScoresList,
  },
  top_assists: {
    url: "https://kingsleague.pro/estadisticas/asistencias/",
    scraper: getAssists,
  },
  players_twelve: {
    url: "https://kingsleague.pro/jugador-12/",
    scraper: getPlayersTwelve,
  },
  top_statistics: {
    scraper: getTopStatistics,
  },
  // coachs: {
  //   url: "https://es.besoccer.com/competicion/info/kings-league/2023",
  //   scraper: getCoaches,
  // },
};

export async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, "")
    .replace(/.*:/g, " ")
    .trim();

export function getImageFromTeam({ name }) {
  const { image } = TEAMS.find((team) => team.name === name);
  return image;
}

export async function scrapeAndSave(file) {
  const start = performance.now();
  try {
    const { url, scraper } = SCRAPINGS[file];
    logInfo(`Scraping ${[file]}`);
    const $ = url ? await scrape(url) : null;
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
