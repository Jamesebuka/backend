//todo  - - - - - - - - - install mailgen

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const from = {
  name: "learnguage",
  email: "no-reply@utcolab.org",
};

exports.verifyEmail = async (to, link) => {
  const msg = {
    from,
    to,
    subject: `Welcome to the Learnguage`,
    html: `
        <p>Click the link below to verify your email</p>
        <a>${process.env.HOST}verifyRegistration/?secure=${link}</a>
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