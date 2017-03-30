export interface PackageStatus {
  total: number,
  monthly: number,
  weekly: number,
  daily: number
}

export interface PackageInfo {
  repository: Repository,
  dataAdded: string,
  name: string,
  categories: string[],
  owner: string,
  id: string,

  versions: PackageVersionData[]
}

export type PackageVersionData = PackageData | {
  readme: string,
  version: string,
  url: string,
  date: string
}

export interface VersionInfo {
  version: string,
  data: string,
  info: PackageData,
  commitID: string
}

export interface Repository {
  project: string,
  owner: string,
  kind: "github"|"bitbucket"
}

export interface PackageData {
  packageDescriptionFile: "dub.json"|"dub.sdl"
}