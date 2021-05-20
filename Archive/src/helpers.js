"use strict";
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
exports.hashPassword = (password) => bcrypt.hashSync(password, salt);
const secret = "lucifertest";
const userQueries = require("./modules/users/userQueries");

const crypto = require("crypto");
const ENCRYPTION_KEY = "ZPUyxiyqGiYyXutHJfG3jTrpnDsh0XqK";
const IV_LENGTH = 16;

/** encrypt */
exports.encrypt = (value) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/** decrypt */
exports.decrypt = (value) => {
  let textParts = value.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

/** compare password */
exports.comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword);
};

/** validate email */
exports.isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/** validate password */
exports.validatePassword = (password) => {
  if (password.length <= 5 || password === "") {
    return false;
  }
  return true;
};

/** is empty or undefined */
exports.isEmpty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
  if (input.replace(/\s/g, "").length) {
    return false;
  }
  return true;
};

/** is empty*/
exports.empty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
};

/** generate jwt token */
exports.generateUserToken = (id, user_id) => {
  const token = jwt.sign(
    {
      id: id,
      user_id: user_id,
    },
    secret,
    { expiresIn: "1d" }
  );
  return `Bearer ${token}`;
};

/** generate and remember jwt token */
exports.generateRememberedToken = (id, is_admin) => {
  const token = jwt.sign(
    {
      user_id: user_id,
    },
    secret,
    { expiresIn: "2d" }
  );
  return `Bearer ${token}`;
};

/** verify token */
exports.verifyToken = (token) => {
  const token_slice = token.replace(/Bearer/g, "").trim();
  const isVerified = jwt.verify(token_slice, secret);
  return isVerified;
};

/** get user id from token */
exports.getUserIdFromToken = (token) => {
  const token_slice = token.replace(/Bearer/g, "").trim();
  var isVerified = jwt.verify(token_slice, secret);
  const id = isVerified["id"];
  return id;
};

/** check user permissions */
exports.checkPermission = async (token, args) => {
  const token_slice = token.replace(/Bearer/g, "").trim();
  var isVerified = jwt.verify(token_slice, secret);
  const id = isVerified["id"];
  var permissions = [];
  await userQueries
    .getUserPermission(id)
    .then((data) => {
      const userPermissions = data["permissions"]
        .replace("[", "")
        .replace("]", "");
      const permissionSlice = userPermissions.split(",");
      permissionSlice.forEach((element) => {
        permissions.push(element.trim());
      });
    })
    .catch((error) => {
      return `User does not exist ${error}`;
    });
  return args.some((r) => permissions.indexOf(r) >= 0);
};

/** get user permissions */
exports.getUserPermissions = async (token) => {
  const token_slice = token.replace(/Bearer/g, "").trim();
  var isVerified = jwt.verify(token_slice, secret);
  const id = isVerified["id"];
  var permissions = [];
  await userQueries
    .getUserPermission(id)
    .then((data) => {
      const userPermissions = data["permissions"]
        .replace("[", "")
        .replace("]", "");
      const permissionSlice = userPermissions.split(",");
      permissionSlice.forEach((element) => {
        permissions.push(element.trim());
      });
    })
    .catch((error) => {
      return `User does not exist ${error}`;
    });
  return { ...[permissions] }
};
