
const path = require("path");
const { consoleTestResultHandler } = require("tslint/lib/test");
const db = require(path.resolve("database"));


/** update user status */
exports.updatePermissions = async function (sid, permissions) {
  return await db.one(`
      UPDATE permissions SET permissions='${permissions}' WHERE sid='${sid}' RETURNING *;
    `);
};

/** check if user exists */
exports.userExists = async function async(sid) {
  return await db.one(`SELECT sid FROM permissions WHERE sid = '${sid}'`);
};
