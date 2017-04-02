import * as koa from "koa";
import packages from "../../../models/packages";

export default async function(ctx: koa.Context) {
  const query: string|undefined = ctx.query["q"];
  const pkgs = await packages.search(query);

  const vers = await Promise.all(
    pkgs.map(pkg => packages.getLatestVersion(pkg))
  );

  ctx.body = vers
              .filter(a => a !== null)
              .map(ver => {
                if(ver === null) throw new Error();
                return {
                  name: ver.name,
                  description: ver.info.description,
                  version: ver.version
                };
              });
}