const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root", // Correct the username
    password: "", // Provide the correct password if you have one
    database: "nodecrud",
});


 db.getConnection(()=>{
    console.log("Db Connection Successfully");
 });

 module.exports = db;