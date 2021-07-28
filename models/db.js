// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'cs5351.southeastasia.cloudapp.azure.com',
//     user: 'root',
//     password: 'Cs5351Passw0rd',
//     database: 'CS5351',
//     insecureAuth: true
// });

// exports.executeQuery = (sql) => {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, (error, rows, fields) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(rows);
//             }
//         });
//     })
// };

const util = require('util');
const mysql = require('mysql');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'Cs5351Passw0rd',
    database: 'CS5351',
    insecureAuth: true,
    connectionLimit: 100,
    //connectTimeout: 20000, // 10 seconds
    //acquireTimeout: 20000, // 10 seconds
    waitForConnections: true, // Default: true
    queueLimit: 0
};
const pool = mysql.createPool(config);
pool.query = util.promisify(pool.query)
module.exports = pool