const monk = require("monk");
const request = require("request-promise-native");

const db = monk("localhost/dub-registry");
const packages = db.get("packages");

async function main() {
  const str = await request("http://code.dlang.org/packages/index.json");
  const list = JSON.parse(str);
  console.log(list.length);

  let cnt = 1;

  const promises = list.map(async (name) => {
    try {
      const obj = JSON.parse(await request(`http://code.dlang.org/api/packages/${name}/info`));
    
      console.log(`${name}:${cnt}/${list.length}`);
    
      delete obj.id;
      delete obj.owner;
      delete obj.versions;
      packages.insert(obj);
    } catch(err){}
    cnt++;
  });

  await Promise.all(promises);
}

main()
  .then(() => {
    db.close();
  });

