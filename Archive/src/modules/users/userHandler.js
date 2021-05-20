const Joi = require("joi");
const path = require("path")
const helper = require(path.resolve("src", "helpers"))
const queries = require("./userQueries");
var email = require("../email/user");
var QRCode = require("qrcode");

/** sign up */
exports.createAccount = async (req, res) => {
  let body = req.body;
  const objectModel = Joi.object().keys({
    login_id: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  try {
    await objectModel.validateAsync(body);
  } catch (err) {
    return res.status(401).json(err["details"]);
  }

  let login_id = body["login_id"];
  let password = body["password"].trim();
  let hashedPassword = helper.hashPassword(password);

  queries
    .createUser(login_id, hashedPassword)
    .then(data => {
      let sid = data["id"];
      const defaultPermissions = "[user]";
      /** setup profile */
      queries.setupProfile(sid).catch((ex) => {});
      /** setup permission */
      queries.setupPermission(sid, defaultPermissions).catch((ex) => {});
      /** send email verification */
      // email.sendVerificationEmail(login_id, sid);
      delete data["password"];
      const token = helper.generateUserToken(data["id"], data["login_id"]);
      const responseData = {
        token: token,
        id: data["id"],
        login_id: data["login_id"],
        created_at: data["created_at"],
        updated_at: data["updated_at"],
      };
      res.json({ ok: "true", status: 200, message: responseData });
    })
    .catch(err => {
      res.json({ ok: "false", status: 400, message: err['detail'] });
    });
};

/** resend verification email */
exports.resendVerificationEmail = async (req, res) => {
  let { email } = req.body;
  //check if email exists
  queries
    .emailExists(email)
    .then((userData) => {
      let user_id = userData["user_id"];
      let id = userData["id"];
      queries.sendVerificationEmail(user_id, id);
      res.json({ ok: "ok", message: "Email sent" });
    })
    .catch((err) => {
      res.json({
        ok: "false",
        message: "The user detail does not match any record on our system",
      });
    });
};

/** verify registration */
exports.verifyRegistration = async (req, res) => {
  let secure = req.query.secure;
  try {
    let decryptedSecure = helper.decrypt(secure);
    queries
      .verifyEmail(decryptedSecure)
      .then((data) => {
        queries
          .verifyAccountStatus(data["user_id"])
          .then((s) => {
            let status = s["status"];
            if (status === "active") {
              res.json({
                ok: "false",
                message: "Account has already been activated",
              });
            } else {
              queries.updateUserStatus(data["user_id"]);
              email.accountActivatedEmail(data["user_id"]);
              res.json({ ok: "true", message: "Account Activated" });
            }
          })
          .catch((err) => {
            res.json({ ok: "false", message: "Could not process request" });
          });
      })
      .catch((err) => {
        res.json({ ok: "false", message: "Could not verify email address" });
      });
  } catch (ex) {
    res.status(404);
    res.json({ ok: "false", message: "Invalid Token Passed" });
  }
};

/** sign in */
exports.signIn = async (req, res) => {
  const body = req.body;
  const user_login_schema = Joi.object().keys({
    login_id: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  try {
    await user_login_schema.validateAsync(body);
  } catch (err) {
    return res.send(err["details"]);
  }
  const login_id = body.login_id;
  const password = body.password;
  queries
    .fetchLoginCredential(login_id)
    .then((data) => {
      if (!helper.comparePassword(data["password"], password)) {
        res.json({ ok: "false", status: 404, message: "The password you provided is incorrect" });
      }
      delete data["password"];
      const token = helper.generateUserToken(data["id"], data["login_id"]);
      const response_data = {
        id: data["id"],
        login_id: data["login_id"],
        created_at: data["created_at"],
        updated_at: data["updated_at"],
        token: token,
      };
      res.json({ ok: "true", status: 201, message: response_data });
    })
    .catch((err) => {
      res.json({ ok: "false", status: 404, message: 'User not found' });
    });
};


/** get current user details */
exports.currentUserDetails = async (req, res) => {
  const token = req.headers.authorization;
  await helper.checkPermission(token, ["user"]).then(data => {
    if (data) {
      var id = helper.getUserIdFromToken(token)
      queries.getUserRecord(id).then(data => {
        delete data['password']
        res.send(data)  
      })
    } else {
      res.send("failed")
    }
  });
};




// generate user qrcode
// const generateQR = async (text, file_name) => {
//   try {
//     await QRCode.toFile(`uploads/public/qrcode/${file_name}.png`, text);
//   } catch (err) {
//     console.error(err);
//   }
// };

// // get qr code
// exports.getQRcode = async (req, res) => {
//   res.send(process.env.HOST + `uploads/qrcode/${req.query.filename}.png`);
//   res.json({ ok: "true", message: "Request successful" });
//   res.status(200);
// };
