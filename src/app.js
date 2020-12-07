const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const db = require('./db/db.js');
const routes = require("./routes/index.js")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use("/",routes)


app.listen(3000, () => {console.log("Server is listening on 3000")})