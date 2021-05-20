const { createWriteStream } = require("fs");
const path = require("path");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const uuid  = require("uuid");

const files = [];


const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
      client_email: process.env.GCLOUD_CLIENT_EMAIL,
      private_key: process.env.GCLOUD_PRIVATE_KEY
  }
});

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const bucket = storage.bucket(process.env.GCS_BUCKET);

module.exports = function (app) {
    app.post("/api/imageupload", multer.single("file"), (req, res) => {
        const newFileName = uuidv1() + "-" + req.file.originalname
        const blob = bucket.file(newFileName)
        const blobStream = blog.createWriteStream()

        blobStream.on("error", err => console.log(err));

        blobStream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`
            const imageDetails = JSON.parse(req.body.data)
            imageDetails.image = publicUrl
        })
    })
}