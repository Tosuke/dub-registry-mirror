import db from "../db";
import { ObjectID } from "mongodb";

export interface Version {
  date: string,
  version: string,
  info: any,
  readme: string,
  commitID: string,
  packageID: ObjectID,
  name: string
}

class Versions {
  find(query?: object, opts?: object): Promise<Version[]> {
    return (() => {
      if(query !== undefined) {
        return db.versions.find(query, opts);
      } else {
        return db.versions.find();
      }
    })().toArray() as Promise<Version[]>;
  }

  findOne(query: object): Promise<Version|null> {
    return db.versions.findOne(query) as Promise<Version|null>;
  }

  getById(id: ObjectID): Promise<Version|null> {
    return this.findOne({_id: id});
  }
}

const versions = new Versions();
export default versions;