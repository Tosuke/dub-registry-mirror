import * as Koa from "koa";
import * as Router from "koa-router";

interface Endpoint {
  path: string,
  file: string
}

const endpoints: Endpoint[] = [
  // /api/packages/:name
  {
    path: "/api/packages/:name/stats",
    file: "/api/packages/name/stats.ts"
  },
  {
    path: "/api/packages/:name/info",
    file: "/api/packages/name/info.ts"
  },

  // /api/packages/:name/:version
  {
    path: "/api/packages/:name/:version/stats",
    file: "/api/packages/name/version/stats.ts"
  },

  // /packages
  {
    path: "/packages/index",
    file: "/packages/index.ts"
  },
  // /packages/:name
  {
    path: "/packages/:name",
    file: "/api/packages/name/info.ts"
  }
];


export function buildRouter() : Router {
  const router = new Router();

  endpoints.forEach(a => {
    let handler = require(`./endpoints/${a.file.replace(/ts$/, "js")}`);
    handler = handler.default || handler;
    router.get(a.path, handler);
  });

  return router;
}