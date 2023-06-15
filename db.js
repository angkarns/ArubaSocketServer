const mysql = require('mysql');
const con = mysql.createConnection({
    host: "10.10.10.88",
    user: "angkarns",
    password: "password",
    database: "iot"
});

con.query('select *from sensors',(err, result, fields) => {
    if (err) {
        return console.log(err);
    }
    return console.log(result);
})

