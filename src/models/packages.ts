import db from "../db";


class Packages {
  async getBy(name: string): Promise<Package> {
    return <Package>(await db.packages.findOne({name: name}));
  }

  async nameList(): Promise<string[]> {
    return (await db.packages.find({})).map(a => a.name);
  }
}


export interface Package {
  name: string,
  repository: {
    project: string,
    owner: string,
    kind: "github"|"bitbucket"
  },
  dateAdded: string,
  categories: string[]
}


const packages = new Packages();
export default packages;