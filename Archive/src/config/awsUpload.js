const multer = require('multer')
const AWS = require('aws-sdk')
const uuid = require('uuid')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

exports.awsUpload = multer({ storage: storage }).any();

