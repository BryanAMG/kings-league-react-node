import leaderBoard from "../db/leaderBoard.json";
import teams from "../db/teams.json";
import presidents from "../db/presidents.json";

import { Hono } from "hono";
import { serveStatic } from "hono/serve-static.module";
// import { serveStatic } from "hono/cloudflare-workers";

const app = new Hono();

app.get("/static/*", serveStatic({ root: "./" }));
app.get("/", (ctx) => {
  return ctx.json([
    {
      endpoint: "/leaderboard",
      description: "Retorna la clasificación de la Kings League",
    },
    {
      endpoint: "/teams",
      description: "Retorna los equipos de la Kings League",
    },
    {
      endpoint: "/presidents",
      description: "Retorna los presidentes de la Kings League",
    },
  ]);
});

app.get("/leaderboard", (ctx) => {
  return ctx.json(leaderBoard);
});
app.get("/teams", (ctx) => {
  return ctx.json(teams);
});
app.get("/presidents", (ctx) => {
  return ctx.json(presidents);
});

app.get("/presidents/:id", (ctx) => {
  const id = ctx.req.param("id");
  const filterPresident = presidents.find((presi) => presi.id === id);
  return filterPresident
    ? ctx.json(filterPresident)
    : ctx.json({ message: "President Not Found" }, 404);
});

app.get("/teams/:id", (ctx) => {
  const id = ctx.req.param("id");
  const filterTeam = teams.find((team) => team.id === id);
  return filterTeam
    ? ctx.json(filterTeam)
    : ctx.json({ message: "Team Not Found" }, 404);
});

app.notFound((c) => {
  const { pathname } = new URL(c.req.url);
  if (pathname.at(-1) === "/") return c.redirect(pathname.slice(0, -1));
  return c.json({ message: "Not Found" }, 404);
});

export default app;
