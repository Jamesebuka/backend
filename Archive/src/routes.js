const api = require("express").Router();
const users = require('./modules/users/userHandler');

const permissions = require('./modules/permissions/permissionsHandler')
const profile = require('./modules/profile/profileHandler')

/** middlewares */
const { upload } = require('./config/localUpload')
 
const {authorization, adminAuthorization} = require('./config/authorization')



const multer = require('multer')
const AWS = require('aws-sdk')
const uuid = require('uuid')



// users
api.post('/signup', users.createAccount);
api.post('/login', users.signIn);
api.get('/user', authorization, users.currentUserDetails);
api.get('/verifyRegistration', users.verifyRegistration);
api.post('/resendVericiation', users.resendVerificationEmail);

// permissions
api.get('/permissions', authorization, upload, permissions.getUserPermissions);
api.put('/permissions/update', adminAuthorization, upload, permissions.updatePermissions);

// profile
api.put('/profile', authorization, upload, profile.updateProfile);
// api.put('/profile/photo',authorization, awsUpload.single('file'), function(req,res){
//     console.log(req.file.filename);
// });


api.put('/profile/photo', multer({ storage: multer.memoryStorage() }).single("file"), profile.updateProfilePhoto);






module.exports = api;