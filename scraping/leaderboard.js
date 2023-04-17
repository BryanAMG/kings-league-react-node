import { PRESIDENTS, TEAMS } from "../db/index.js";
// para node no podemos importar json directamente - especificacion ecma script modules

const LEADERBOARD_SELECTORS = {
  team: { selector: "td div.el-text-3 ", typeOf: "string" },
  wins: { selector: "td div.el-text-4", typeOf: "number" },
  loses: { selector: "td div.el-text-5", typeOf: "number" },
  goalsScored: { selector: "td div.el-text-6", typeOf: "number" },
  goalsConceded: { selector: "td div.el-text-7", typeOf: "number" },
  diferencedGoals: { selector: "td div.el-text-8", typeOf: "number" },
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
