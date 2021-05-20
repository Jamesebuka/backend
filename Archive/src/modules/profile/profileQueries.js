const path = require("path");
const db = require(path.resolve("database"));

/** update user status */
exports.updateProfile = async function (user, userObject) {
  var firstName = userObject.firstName;
  var lastName = userObject.lastName;
  var otherNames = userObject.otherNames;
  var socialLinks = userObject.socialLinks;
  var bio = userObject.bio;

  return await db.one(`
      UPDATE profile SET first_name='${firstName}', last_name='${lastName}', other_names='${otherNames}', social_links='${socialLinks}', bio='${bio}' WHERE sid='${user}' RETURNING *;
    `);
};
