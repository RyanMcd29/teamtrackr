const mysql = require ('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Bootcamp',
        database: 'employee_db'
    },
);

db.connect((error) => {
    if (error) throw error;
})

module.exports = db;