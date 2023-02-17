/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import leaderBoard from "../db/leaderBoard.json";
import { Hono } from "hono";

const app = new Hono();

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
