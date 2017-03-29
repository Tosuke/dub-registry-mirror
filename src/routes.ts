import * as Koa from "koa";
import * as Router from "koa-router";

interface Endpoint {
  path: string,
  file: string
}

const endpoints: Endpoint[] = [
  {
    path: "/api/packages/:name/stats",
    file: "/api/packages/name/stats.ts"
  },
  {
    path: "/api/packages/:name/:version/stats",
    file: "/api/packages/name/version/stats.ts"
  }
];


export function buildRouter() : Router {
  const router = new Router();

  endpoints.forEach(a => {
    const handler = require(`./endpoints/${a.file.replace(/ts$/, "js")}`);
    router.get(a.path, handler);
  });

  return router;
}