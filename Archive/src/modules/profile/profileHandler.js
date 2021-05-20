const Joi = require("joi");
const path = require("path");
const uuid = require("uuid");
const helper = require(path.resolve("src", "helpers"));
const queries = require("./profileQueries");
var email = require("../email/user");
const AWS = require('aws-sdk')

/** update profile */
exports.updateProfile = async (req, res) => {
  
  let body = req.body;

  const objectModel = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    otherNames: Joi.string().required(),
    socialLinks: Joi.string().required(),
    bio: Joi.string().required(),
  });

  try {
    await objectModel.validateAsync(body);
  } catch (err) {
    res.status(401).json(err["details"]);
  }

  const token = req.headers.authorization;
  var id = helper.getUserIdFromToken(token);
  await queries
    .updateProfile(id, body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

/** update profile photo */
exports.updateProfilePhoto = async ( req, res) => {
  if (req.file) {
    var originalname = req.file.originalname.split(' ');
    console.log(originalname)
    const fileName = originalname.join('_');
    try {
      let myFile = req.file.originalname.split(".")
      const fileType = myFile[myFile.length - 1]
  
      const params = {
          Bucket: process.env.AWS_BUCKET_NAME + "/uploads/user_image",
          Key: `${uuid.v4()}.${fileType}`,
          Body: req.file.buffer
      }
      s3.upload(params, (error, data) => {
          if(error){
              res.status(500).send(error)
          }
          res.status(200).send(data)
      })
    } catch (err) {
      return res.json({ 'success': false, 'message': err });
    }
  }
};
