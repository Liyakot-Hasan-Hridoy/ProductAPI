const express = require("express");
const db = require("./config/dbconnection");

const app = express();
const authRoute = require("./routes/auth_route");

app.use(express.json());



app.use(authRoute);


app.listen(3000, () => {
   console.log("Server Port Running.");

});