import { readDBFile, TEAMS } from "../db/index.js";

const LIMIT_TOP = 5;

const getLimitFrom = (array) => array.slice(0, LIMIT_TOP);

const [mvpDB, topScorersDB, topAssistsDB, playersTwelveDB] = await Promise.all([
  readDBFile("mvp"),
  readDBFile("top_scorers"),
  readDBFile("top_assists"),
  readDBFile("players_twelve"),
]);

export function getTopStatistics() {
  const mvp = getLimitFrom(mvpDB).map(extractMoreData);
  const topScorers = getLimitFrom(topScorersDB).map(extractMoreData);
  const topAssists = getLimitFrom(topAssistsDB).map(extractMoreData);

  return { mvp, topScorers, topAssists };
}

function extractMoreData(player) {
  const { team: teamName } = player;
  // team 1k
  const playerFind = playersTwelveDB.find((playerTwelve) => {
    const { firstName, lastName } = playerTwelve;
    const newPlayerName = lastName
      ? `${firstName.at(0)}. ${lastName}`
      : firstName;
    return newPlayerName === player.playerName;
  });
  if (playerFind) {
    const {
      team: { id: teamId, imageWhite: imageReverse },
      image: playerImage,
    } = playerFind;
    return {
      ...player,
      imageReverse,
      playerImage,
      teamId,
    };
  } else {
    const team = TEAMS.find((team) => team.name === teamName);
    const { players, id: teamId, imageReverse } = team;
    const playerImage = findPlayerImage({
      playerName: player.playerName,
      players,
    });
    return {
      ...player,
      imageReverse,
      playerImage,
      teamId,
    };
  }
}

function findPlayerImage({ playerName, players }) {
  const player = players.find((player) => player.dorsalName === playerName);

  const playerImage = player?.image ? `${player.image}` : "placeholder.png";

  // buscar player 12

  return playerImage;
}
