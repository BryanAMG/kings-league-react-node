import leaderBoard from "../db/leaderBoard.json";
import { Hono } from "hono";
import { serveStatic } from "hono/serve-static.module";
// import { serveStatic } from "hono/cloudflare-workers";

const app = new Hono();

app.get("/static/*", serveStatic({ root: "./" }));
app.get("/", (ctx) => {
  return ctx.json([
    {
      endpoint: "/leaderboard",
      description:
        "Tabla informatima de la clasificación de equipos de la Kings League",
    },
  ]);
});

app.get("/leaderboard", (ctx) => {
  return ctx.json(leaderBoard);
});

export default app;
