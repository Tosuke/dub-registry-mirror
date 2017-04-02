const mongo = require("mongodb");

async function main() {
  const data = await request("http://code.dlang.org");
  console.log(`packages: ${data.packages.length}, versions: ${data.versions.length}`);

  const db = mongo.MongoClient.connect("mongodb://localhost:27017/dub-registry");
  const packages = db.collection("packages");
  const versions = db.collection("versions")

  await versions.insert(data.versions);
  
  data.packages = await Promise.all(data.packages.map(async (package) => {
    package.versions = (await versions.find({name: package.name})).map((ver) => ver._id);
    return package;
  }));

  await packages.insert(data.packages);
  
  db.close();
}

main();

async function request(url) {
  let packages = [];
  let versions = [];

  const list = await getContent(`${url}/packages/index.json`);
  console.log(list);

  await Promise.all(list.map(async (name) => {
    let package = await getContent(`${url}/api/packages/${name}/info`);
    if(package === undefined) return;

    console.log(name);
    
    await Promise.all(package.versions.map(a => a.version).map(async (vername) => {
      if(/^~/.test(vername)) return;
      let version = await getContent(`${url}/api/packages/${name}/${vername}/info`);
      if(version === undefined) return;

      console.log(`${name}/${vername}`);

      version.name = name;
      if(version.readme !== undefined) {
        version.readme = package.versions.filter((v, i, arr) => v.version === vername)[0].readme;
      }
      versions.push(version);
    }));

    delete package.id;
    delete package.owner;
    packages.push(package);
  }));

  return {
    packages,
    versions
  };
}


async function getContent(url) {
  try {
    const request = require("request-promise-native");

    const str = await request(url);
    return JSON.parse(str);
  } catch(err) {
    return undefined;
  }
}