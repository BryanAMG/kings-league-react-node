import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const URLS = {
  leaderBoard: "https://kingsleague.pro/clasificacion/",
};

async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

// Esto se ejecutara cada 4 horas o 3 para que se actualice
// primero se guarda en un fichero estatico
// despues una base de datos
async function getLeaderBoard() {
  const LEADERBOARD_SELECTORS = {
    team: { selector: "td.fs-table-text_3", typeOf: "string" },
    wins: { selector: "td.fs-table-text_4", typeOf: "number" },
    loses: { selector: "td.fs-table-text_5", typeOf: "number" },
    goalsScored: { selector: "td.fs-table-text_6", typeOf: "number" },
    goalsConceded: { selector: "td.fs-table-text_7", typeOf: "number" },
    cardsYellow: { selector: "td.fs-table-text_8", typeOf: "number" },
    cardsRed: { selector: "td.fs-table-text_9", typeOf: "number" },
  };
  const $ = await scrape(URLS.leaderBoard);
  const $rows = $("table tbody tr");

  //  Por si tuvieamos : "Equipo:\n\n\n\tPio Fc"
  const cleanText = (text) =>
    text.replace(/\t|\n|\s/g, "").replace(/.*:/g, " ");

  const leaderBoard = [];
  $rows.each((_, fila) => {
    const $el = $(fila);
    // const rawTeam = $el.find("td.fs-table-text_3").text().trim();
    // const rawWins = $el.find("td.fs-table-text_4").text().trim();
    // const rawLoses = $el.find("td.fs-table-text_5").text().trim();
    // const rawGoalsScored = $el.find("td.fs-table-text_6").text().trim();
    // const rawGoalsConceded = $el.find("td.fs-table-text_7").text().trim();
    // const rawCardsYellow = $el.find("td.fs-table-text_8").text().trim();
    // const rawCardsRed = $el.find("td.fs-table-text_9").text().trim();
    const arrayTeamEntries = Object.entries(LEADERBOARD_SELECTORS).map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text().trim();
        // convertir si es numero u otro :v tipo de dato
        // const value = isNan(Number(value)) ? value : Number(value)
        const value = typeOf === "number" ? Number(rawValue) : rawValue;
        return [key, value];
      }
    );
    leaderBoard.push(Object.fromEntries(arrayTeamEntries));
  });

  return leaderBoard;
}
const resultLeaderBoard = await getLeaderBoard();
// /D:/PROYECTOS/REACT/kings-league/scraping/db/leaderBoard.json'
// const filePath = new URL("./db/leaderBoard.json", import.meta.url);

// creando ruta relativaa de fichero :V
// cwd = current working directory - desde donde se ejecuta el script
// path.resolve() == process.cwd() = D:\PROYECTOS\REACT\kings-league
const filePath = join(resolve(), "db", "leaderBoard.json");
console.log(filePath);

await writeFile(filePath, JSON.stringify(resultLeaderBoard, null, 2), "utf-8");
// cada vez q el usuario quiera llama eejcuta la funcion  https://workers.cloudflare.com/
