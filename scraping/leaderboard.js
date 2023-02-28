import { PRESIDENTS, TEAMS } from "../db/index.js";
// para node no podemos importar json directamente - especificacion ecma script modules

const LEADERBOARD_SELECTORS = {
  team: { selector: "td.fs-table-text_3", typeOf: "string" },
  wins: { selector: "td.fs-table-text_4", typeOf: "number" },
  loses: { selector: "td.fs-table-text_5", typeOf: "number" },
  goalsScored: { selector: "td.fs-table-text_6", typeOf: "number" },
  goalsConceded: { selector: "td.fs-table-text_7", typeOf: "number" },
  cardsYellow: { selector: "td.fs-table-text_8", typeOf: "number" },
  cardsRed: { selector: "td.fs-table-text_9", typeOf: "number" },
};

export async function getLeaderBoard($) {
  const $rows = $("table tbody tr");

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
  $rows.each((index, fila) => {
    const $el = $(fila);
    const arrayTeamEntries = Object.entries(LEADERBOARD_SELECTORS).map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text().trim();
        // const value = isNaN(Number(value)) ? value : Number(value)
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
      rank: index + 1,
    });
  });

  return leaderBoard;
}

// cwd = current working directory - desde donde se ejecuta el script
// path.resolve() == process.cwd() = D:\PROYECTOS\REACT\kings-league
// API EN cloudflare workers : escala al infinito - bd a traves de ficheros
