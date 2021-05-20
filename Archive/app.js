require("dotenv").config();
require("app-module-path").addPath(__dirname);
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

/** home api */
app.get("/", async (req, res) => {
  res.json({
    status: "ok",
    message: "Connected 👌 ",
  });
  res.status(200);
});


/** cors allowed list */
var allowlist = ["http://localhost:8080"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    /** reflect (enable) the requested 
     * origin in the CORS response */
    corsOptions = { origin: true };
  } else {
    /** disable CORS for this request */
    corsOptions = { origin: false }; 
  }
  /** callback expects two 
   * parameters: error 
   * and options*/ 
  callback(null, corsOptions); 
};
app.use(cors(corsOptionsDelegate));


/** handlers */
const api = require("./src/routes.js");

/** api routes */
app.use("/api/v1/", api);


/** lift's off the server */ 
app.listen(process.env.PORT, () =>
  console.log("🚀 server launched on port 👌 ", process.env.PORT)
);