import * as mongo from "mongodb";

export class DB {
  private db: mongo.Db;
  
  private packages_: mongo.Collection;
  private versions_: mongo.Collection;

  get packages() {
    return this.packages_;
  }

  get versions() {
    return this.versions_;
  } 

  public constructor(uri: string) {
    mongo.MongoClient.connect(uri)
      .then(db => {
        this.db = db;

        this.packages_ = this.db.collection("packages");
        this.versions_ = this.db.collection("versions");

        console.info("[INFO] succeeded to connect MongoDB")
      })
  }

  public close(): void {
    this.db.close();
  }
}

const db: DB = new DB("mongodb://localhost:27017/dub-registry");
export default db;