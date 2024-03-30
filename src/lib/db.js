const mysql = require('mysql2');

const db = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "wlfkfgksp!!55",
    database : "youth",
    waitForConnections: true
})


const dataTable = {
    db,
}

module.exports = { dataTable }