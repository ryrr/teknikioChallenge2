const express = require('express')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express()
const db = require('./db/db.js');
const config = require('../config.js')
const routes = require("./routes/index.js")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", resave: true, saveUninitialized: true}));

app.use("/",routes)

app.listen(config.app.port, () => {console.log("Server is listening on 3000")})