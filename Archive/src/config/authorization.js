const path = require("path");
const helper = require(path.resolve("src", "helpers"));
const { upload } = require("./localUpload");
const db = require("../../database");

exports.authorization = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    helper.verifyToken(token);
    userExists(helper.getUserIdFromToken(token)).catch((err) => {
      res
        .json({
          ok: "false",
          message: "invalid user account",
        })
        .end();
    });
    next();
  } catch (err) {
    res
      .json({
        ok: "false",
        message: "bad token",
      })
      .end();
  }
};

/** check if user has admin permission */
exports.adminAuthorization = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    await helper.checkPermission(token, ["admin"]).then((data) => {
      if (data) {
        next();
      } else {
        res.json({
          ok: "false",
          message: "sorry, you do now have admin privillages",
        });
      }
    });
  } catch (err) {
    res
      .json({
        ok: "false",
        message: "bad token",
      })
      .end();
  }
};

/** check if user exists */
const userExists = async function async(sid) {
  return await db.one(`SELECT sid FROM permissions WHERE sid = '${sid}'`);
};
