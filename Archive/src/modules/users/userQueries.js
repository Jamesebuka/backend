const path = require("path");
const db = require(path.resolve("database"));

/** create user */
exports.createUser = async function (login_id, hashedPassword) {
  return await db.one(
    "INSERT INTO users(login_id, password) VALUES(${login_id}, ${hashedPassword}) RETURNING *",
    { login_id, hashedPassword }
  );
};

/** setup user profile */
exports.setupProfile = async function (sid) {
  return await db.one(
    'INSERT INTO profile (sid) VALUES(${sid}) RETURNING *',
    { sid }
  );
};

/** setup user permission */
exports.setupPermission = async function (sid, permissions) {
  db.one(
    'INSERT INTO permissions(sid, permissions) VALUES(${sid}, ${permissions}) RETURNING *',
    { sid, permissions }
  );
};

/** fetch user details */
exports.fetchLoginCredential = async function (login_id) {
  return await db.one(`SELECT * FROM users WHERE login_id = '${login_id}'`);
};

/** email exists id */
exports.verifyEmail = async function (id) {
  return await db.one(`SELECT * FROM users WHERE id = '${id}'`);
};

/** email exists using login_id (email) */
exports.emailExists = async function (login_id) {
  return await db.one(
    `SELECT id, login_id FROM users WHERE login_id = '${email}'`
  );
};

/** update user status */
exports.updateUserStatus = async function (login_id) {
  return await db.one(`
      UPDATE users SET status='active' WHERE login_id='${login_id}';
    `);
};

/** check user status */
exports.verifyAccountStatus = async function (login_id) {
  return await db.one(
    `SELECT status FROM users WHERE login_id = '${login_id}'`
  );
};

/** get user record */
exports.getUserRecord = async function (id) {
  return await db.one(`SELECT * FROM users WHERE id = '${id}'`);
};

/** get permission from Permissions using user id */
exports.getUserPermission = async function (id) {
  return await db.one(
    `SELECT permissions FROM permissions WHERE sid = '${id}'`
  );
};
