import * as Koa from "koa";
import * as Router from "koa-router";

interface Endpoint {
  path: string,
  file: string
}

const endpoints: Endpoint[] = [
  // test
  {
    path: "/test",
    file: "/test.ts"
  },

  // /api/packages
  {
    path: "/api/packages/search",
    file: "/api/packages/search.ts"
  },

  // /api/packages/:name
  {
    path: "/api/packages/:name/stats",
    file: "/api/packages/name/stats.ts"
  },
  {
    path: "/api/packages/:name/info",
    file: "/api/packages/name/info.ts"
  },
  {
    path: "/api/packages/:name/latest",
    file: "/api/packages/name/latest.ts"
  },

  // /api/packages/:name/:version
  {
    path: "/api/packages/:name/:version/stats",
    file: "/api/packages/name/version/stats.ts"
  },
  {
    path: "/api/packages/:name/:version/info",
    file: "/api/packages/name/version/info.ts"
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
  },
  // /package/:name/:version
  {
    path: "/packages/:name/:version",
    file: "/packages/name/version.ts"
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