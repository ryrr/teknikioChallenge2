const bcrypt = require('bcrypt');
const db = require('../db/db.js')

exports.hashPassword = async(password) =>{
    const saltRounds = 10;
    let hashedPass = await bcrypt.hash(password,saltRounds)
    return hashedPass
}

exports.verifyPassword = async(password,hash) =>{
    let hashedPass = await bcrypt.compare(password,hash)
    return hashedPass
}