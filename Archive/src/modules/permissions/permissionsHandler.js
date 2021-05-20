const Joi = require("joi");
const path = require("path");
const helper = require(path.resolve("src", "helpers"));
const queries = require("./permissionsQuerry");

/** get current user permissions */
exports.getUserPermissions = async (req, res) => {
  const token = req.headers.authorization;
  await helper.getUserPermissions(token).then((data) => {
    res.send(data);
  });
};

/** get current user permissions */
exports.updatePermissions = async (req, res) => {
  let body = req.body;
  const objectModel = Joi.object().keys({
    sid: Joi.string().required(),
    permissions: Joi.string().required(),
  });
  try {
    await objectModel.validateAsync(body);
  } catch (err) {
    return res.status(401).json(err["details"]);
  }
  const { sid, permissions } = req.body;

  queries.userExists(sid).catch((err) => {
    res.json({
      ok: "false",
      status: 404,
      message: "user was not found",
    });
  });
  queries.updatePermissions(sid, permissions).then((data) => {
    res.json({
      ok: "true",
      status: 201,
      message: "Permission Updated",
      data: data,
    });
  });
};
