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

const upload = multer({storage}).any()

app.post('/upload',upload,(req, res) => {
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME + "/public/images",
        Key: `${uuid.v4()}.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

app.post('/textUpload', upload, function (req, res, next) {
    // req.body contains the text fields
    console.log(req.body['username'])
    req.files.forEach( function(f) {
        console.log(f);
        if(f['fieldname'] == 'image') {
            console.log(f['originalname'])
        }
      });
    res.send("Done")
})

app.post('/login', upload, function(req, res, next) {
    console.log(req.body.data["username"])
    console.log(req.body.data["password"])
    res.send("done")
})