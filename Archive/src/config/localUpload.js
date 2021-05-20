const multer = require("multer");
const uuid = require("uuid");

/** setup storage */
const storage = multer.diskStorage({
  /** destination */
  destination: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, `$/learnguage`);
    }
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, `learnguage`);
    }
  },

  /** filename */
  filename: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, `${uuid.v4()}.pdf`);
    }
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      if(file.fieldname === "profile_photo")
        cb(null, `/uploads/public/user_image/${uuid.v4()}.png`);
      }
  },
  fileSize: 20000000,
  fileFilter: function (req, file, cb) {},
});


exports.upload = multer({ storage: storage }).any();
