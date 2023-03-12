import { getImageFromTeam } from "./utils.js";

const MVP_SELECTORS = {
  team: { selector: "td.fs-table-text_3", typeOf: "string" },
  playerName: { selector: "td.fs-table-text_4", typeOf: "string" },
  gamesPlayed: { selector: "td.fs-table-text_5", typeOf: "number" },
  mvps: { selector: "td.fs-table-text_6", typeOf: "number" },
};

export async function getMvpPlayers($) {
  const $rows = $("table tbody tr");

  const mvpList = [];
  $rows.each((index, row) => {
    const $oneMvpHtml = $(row);
    const arrayEntriesMvp = Object.entries(MVP_SELECTORS).map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $oneMvpHtml.find(selector).text().trim();
        const value = typeOf === "number" ? Number(rawValue) : rawValue;
        return [key, value];
      }
    );

    const { team: teamName, ...restOfData } =
      Object.fromEntries(arrayEntriesMvp);
    const image = getImageFromTeam({ name: teamName });

    mvpList.push({
      ...restOfData,
      rank: index + 1,
      team: teamName,
      image,
    });
  });
  return mvpList;
}
