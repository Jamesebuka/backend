const pgp = require("pg-promise")({});

const conn = process.env.DB;
// const conn = process.env.DB;

const db = pgp(conn);

db.one(`select 'database' as value;`)
    .then(function (data) {
        console.log('🏬 db connected 🤝')
    })
    .catch(function (error) {
        console.log('db not found or does not exists')
    })

module.exports = db

