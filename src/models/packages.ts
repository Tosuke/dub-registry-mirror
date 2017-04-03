import db from "../db";
import { ObjectID, Cursor } from "mongodb";

import { Version } from "./versions";
import versions from "./versions";
import * as semver from "semver";

class Packages {
  find(query?: object, opts?: object): Cursor<Package> {
    return (() => {
      if(query !== undefined) {
        return db.packages.find(query, opts);
      } else {
        return db.packages.find();
      }
    })() as Cursor<Package>;
  }

  findOne(query: object): Promise<Package|null> {
    return db.packages.findOne(query) as Promise<Package|null>;
  }

  updateMany(query: object, update: object): void {
    db.packages.updateMany(query, update);
  }

  updateOne(query: object, update: object): void {
    db.packages.updateOne(query, update);
  }

  getByID(id: ObjectID): Promise<Package|null> {
    return this.findOne({_id: id});
  }

  updateByID(id: ObjectID, update: Package): void {
    this.updateOne({_id: id}, update);
  }

  getByName(name: string): Promise<Package|null> {
    return this.findOne({ name });
  }

  nameList() {
    return this.find().toArray().then(arr => arr.map(a => a.name));
  }

  async getLatestVersion(pkg: Package): Promise<Version|null> {
    if(pkg.latestVersion !== undefined) {
      const ver = await versions.getById(pkg.latestVersion);
      if(ver !== null) {
        return ver;
      }
    }

    const vers = (await Promise.all(
      pkg.versions.map(verID => {
        return versions.getById(verID);
      })))
      .filter(a => a !== null) as Version[]
    
    if(vers.length === 0) {
      return await versions.getByName(pkg.name, "~master");
    }
    if(vers.length === 1) {
      return vers[0];
    }

    const latestVer = vers
                      .reduce((a, b, i, arr) => {
                        if(semver.valid(b.version) === undefined) return a;
                        if(semver.valid(a.version) === undefined) return b;
                      
                        return semver.gt(b.version, a.version) ? b : a;
                      });
    
    this.updateOne({_id: pkg._id}, {$set: {latestVersion: latestVer._id}});
    
    return latestVer;
  }

  async search(query?: string): Promise<Package[]> {
    if(query === undefined) return await this.find().toArray();
    
    const self = this;
    const set = new Set((await versions.search(query)).map(a => a.packageID.toString()));

    const iter = (function *() {
      for(const id of set.values()) {
        yield self.getByID(new ObjectID(id));
      }
    })();

    const list = await Promise.all(iter);
    return list.filter(a => a !== null) as Package[];
  }
}


export interface Package {
  _id: ObjectID
  name: string
  repository: {
    project: string
    owner: string
    kind: "github"|"bitbucket"
  }
  dateAdded: string
  categories: string[]
  latestVersion?: ObjectID
  versions: ObjectID[]
}


const packages = new Packages();
export default packages;