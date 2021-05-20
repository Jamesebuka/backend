const sgMail = require("@sendgrid/mail");
const path = require("path");
const helper = require(path.resolve("src", "helpers.js"))
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const from = {
  name: "learnguage",
  email: "no-reply@utcolab.org",
};

// send email verification
exports.sendVerificationEmail = function (email, id) {
    let encrypted = helper.encrypt(id);
    verifyEmail(email, encrypted);
};

const verifyEmail = async (to, link) => {
  const msg = {
    from,
    to,
    subject: `Welcome to the Learnguage`,
    html: `
        <p>Click the link below to verify your email</p>
        <a href='${process.env.HOST}verifyRegistration/?secure=${link}'>Verify Account</a>
        `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.accountActivatedEmail = async (to) => {
    const msg = {
      from,
      to,
      subject: `See all courses to start learning today!`,
      html: `<p>Your account has been activated successfully</p>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  };


/** todo  - - - - - - - - - install mailgen */