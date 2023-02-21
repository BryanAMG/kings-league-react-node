import * as cheerio from "cheerio";
import { resolve, join } from "node:path";
import { PRESIDENTS, TEAMS, writeDBFile } from "../db/index.js";
// para node no podemos importar json directamente - especificacion ecma script modules

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
  const $ = await scrape(URLS.leaderBoard);
  const $rows = $("table tbody tr");

  const LEADERBOARD_SELECTORS = {
    team: { selector: "td.fs-table-text_3", typeOf: "string" },
    wins: { selector: "td.fs-table-text_4", typeOf: "number" },
    loses: { selector: "td.fs-table-text_5", typeOf: "number" },
    goalsScored: { selector: "td.fs-table-text_6", typeOf: "number" },
    goalsConceded: { selector: "td.fs-table-text_7", typeOf: "number" },
    cardsYellow: { selector: "td.fs-table-text_8", typeOf: "number" },
    cardsRed: { selector: "td.fs-table-text_9", typeOf: "number" },
  };

  const getTeambyName = (name) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(
      (team) => team.name === name
    );

    const president = PRESIDENTS.find(
      (presidente) => presidente.id == presidentId
    );

    return { ...restOfTeam, president };
  };

  const leaderBoard = [];
  $rows.each((_, fila) => {
    const $el = $(fila);
    const arrayTeamEntries = Object.entries(LEADERBOARD_SELECTORS).map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text().trim();
        // convertir si es numero u otro :v tipo de dato
        // const value = isNan(Number(value)) ? value : Number(value)
        const value = typeOf === "number" ? Number(rawValue) : rawValue;
        return [key, value];
      }
    );

    const { team: nameTeam, ...leaderBoardTeam } =
      Object.fromEntries(arrayTeamEntries);
    const team = getTeambyName(nameTeam);
    leaderBoard.push({
      ...leaderBoardTeam,
      team,
    });
  });

  return leaderBoard;
}
const resultLeaderBoard = await getLeaderBoard();
// creando ruta relativaa de fichero :V
// cwd = current working directory - desde donde se ejecuta el script
// path.resolve() == process.cwd() = D:\PROYECTOS\REACT\kings-league
const filePath = join(resolve(), "db", "leaderBoard.json");

await writeDBFile(filePath, resultLeaderBoard);
// cada vez q el usuario quiera llama eejcuta la funcion  https://workers.cloudflare.com/
