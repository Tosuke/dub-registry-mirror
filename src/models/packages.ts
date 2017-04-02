import db from "../db";
import { ObjectID } from "mongodb";

import { Version } from "./versions";
import versions from "./versions";
import * as semver from "semver";

class Packages {
  find(query?: object, opts?: object): Promise<Package[]> {
    return (() => {
      if(query !== undefined) {
        return db.packages.find(query, opts);
      } else {
        return db.packages.find();
      }
    })().toArray() as Promise<Package[]>;
  }

  findOne(query: object): Promise<Package|null> {
    return db.packages.findOne(query) as Promise<Package|null>;
  }

  getByName(name: string): Promise<Package|null> {
    return this.findOne({ name });
  }

  async nameList(): Promise<string[]> {
    return (await this.find()).map(a => a.name);
  }

  async getLatestVersion(pkg: Package): Promise<string> {
    const ret =
      (await Promise.all(pkg.versions.map(async (verID) => {
        const ver = await versions.getById(verID);
        return ver !== null ? ver.version : null;
      })))
      .reduce((a, b, i, arr) => {
        if(a === null || semver.valid(a) === undefined) return b;
        if(b === null || semver.valid(b) === undefined) return a;

        return semver.gt(b, a) ? b : a;
      }, null);

    return ret !== null ? ret : "~master"; 
  }

  //async search(query: string): Promise<Package[]> {}
}


export interface Package {
  name: string,
  repository: {
    project: string,
    owner: string,
    kind: "github"|"bitbucket"
  },
  dateAdded: string,
  categories: string[],
  versions: ObjectID[]
}


const packages = new Packages();
export default packages;