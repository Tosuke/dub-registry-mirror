import * as monk from "monk";

class DB {
  private db: monk.Manager;
  
  readonly packages: monk.Collection;
  readonly versions: monk.Collection;

  public constructor(uri: string) {
    this.db = monk(uri);
    this.packages = this.db.get("packages");
    this.versions = this.db.get("versions");
  }

  public close(): void {
    this.db.close();
  }
}

const db = new DB("localhost/dub-registry");
export default db;