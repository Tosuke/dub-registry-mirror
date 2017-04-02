import db from "../db";
import { ObjectID, Cursor } from "mongodb";

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
  find(query?: object, fields?: object): Cursor<Version> {
    return (() => {
      if(query !== undefined) {
        return db.versions.find(query, fields);
      } else {
        return db.versions.find();
      }
    })() as Cursor<Version>;
  }

  findOne(query: object): Promise<Version|null> {
    return db.versions.findOne(query) as Promise<Version|null>;
  }

  getById(id: ObjectID): Promise<Version|null> {
    return this.findOne({_id: id});
  }

  getByName(name: string, vername: string): Promise<Version|null> {
    return this.findOne({ name: name, version: vername });
  }

  search(query: string): Promise<Version[]> {
    const q = {
      $text: {
        $search: query
      }
    }
    const field = {
      score: {
        $meta: "textScore"
      }
    }
    return this.find(q, field)
            .sort({score: {$meta: "textScore"}})
            .map(a => {
              delete a.score;
              return a;
            })
            .toArray()
  }
}

const versions = new Versions();
export default versions;