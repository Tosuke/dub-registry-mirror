import * as koa from "koa";
import packages from "../../../../models/packages";
import versions from "../../../../models/versions";
import {Version} from "../../../../models/versions";

export default async function info(ctx: koa.Context) {
  const name = ctx.params["name"];
  const pkg = await packages.getByName(name);
  if(pkg === null) {
    ctx.status = 404;
    ctx.body = {
      message: "package is not found"
    };
    return;
  }
  
  const versionInfos = await Promise.all(
    pkg.versions
      .map(id => versions.getById(id))
      .filter(async (ver) => (await ver) !== null)
      .map(async (ver) => versions.toPackageVersion(<Version>await ver))
  );

  ctx.body = {
    repository: pkg.repository,
    dateAdded: pkg.dateAdded,
    name: pkg.name,
    categories: pkg.categories,
    id: pkg._id,
    versions: versionInfos
  }
}