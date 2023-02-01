const MONGO_REPLICA_NAME = process.env['MONGO_REPLICA_NAME'];
const MONGO_HOST_REPLICA_1 = process.env['MONGO_HOST_REPLICA_1'];
const MONGO_HOST_REPLICA_2 = process.env['MONGO_HOST_REPLICA_2'];
const MONGO_HOST_REPLICA_3 = process.env['MONGO_HOST_REPLICA_3'];
const MONGO_INITDB_ROOT_USERNAME = process.env['MONGO_INITDB_ROOT_USERNAME'];
const MONGO_INITDB_ROOT_PASSWORD = process.env['MONGO_INITDB_ROOT_PASSWORD'];

try {
  rs.status();
} catch (err) {
  const cfg = {
    "_id": MONGO_REPLICA_NAME,
    "protocolVersion": 1,
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": `${MONGO_HOST_REPLICA_1}:27017`,
        "priority": 2
      },
    ]
  };
  rs.initiate(cfg, { force: true });

  while (true) {
    const isMaster = db.runCommand("ismaster");
    if (isMaster.ismaster) {
      break;
    }
  }

  const admin = db.getSiblingDB("admin");
  admin.createUser(
    {
      user: MONGO_INITDB_ROOT_USERNAME,
      pwd: MONGO_INITDB_ROOT_PASSWORD,
      roles: [ { role: "root", db: "admin" } ]
  });
  db.getSiblingDB("admin").auth(MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD);
  
  rs.add({ host: `${MONGO_HOST_REPLICA_2}:27017`, priority: 0 });
  rs.add({ host: `${MONGO_HOST_REPLICA_3}:27017`, priority: 0 });

  rs.status();
}