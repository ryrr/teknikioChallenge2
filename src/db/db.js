var mysql = require('mysql2/promise');
const util = require('../utility/util.js')

const connection =  mysql.createConnection({
    host: "localhost",
    port:'3306',
    user: "root",
    password: "3LongPenguins",
    database:'carshare'
});




exports.register = async (username,hashedPass)=>{
    const db = await connection
    const userExists = await getPassword(username)
    if(userExists){
        return {'error':true,'msg':`username: ${username} already exists try again!`}
    }
    else{
        try{
            const [rows] = await db.execute(`INSERT INTO users (username,password)VALUES('${username}','${hashedPass}');`)
            return {'error':false,'msg':`${username} registered successfully!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}

exports.login = async (username,password)=>{
    const db = await connection
    const hash = await getPassword(username)
    if(hash){
        let isVerified = await util.verifyPassword(password,hash)
        if(isVerified){return true}
        else{return false}
    }   
    else{
        return false
    }
}

exports.addCar = async (vin,carname)=>{
    const db = await connection
    const vinExists = await getCar(vin)
    if(vinExists){
        return {'error':true,'msg':`VIN: ${vin} is already registered`}
    }
    else{
        try{
            const [rows] = await db.execute(`INSERT INTO cars (VIN,name)VALUES('${vin}','${carname}');`)
            return {'error':false,'msg':`${carname} registered successfully!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}

exports.addOwner = async (vin, username)=>{
    const db = await connection
    //GET USERID FROM USEREXISTS!!!!
    const userExists = await getPassword(username)
    if(!userExists){
        return {'error':true,'msg':`username: ${username} doesn't exist try again!`}
    }
    else{
        try{
            const [rows] = await db.execute(`INSERT INTO ownership (VIN,user_id)VALUES('${vin}','${user_id}');`)
            return {'error':false,'msg':`${username} is now an owner of car with VIN ${vin}!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}

exports.removeOwner = async (vin,username)=>{
    const db = await connection
    //GET USERID FROM USEREXISTS!!!!
    const userExists = await getPassword(username)
    if(!userExists){
        return {'error':true,'msg':`username: ${username} doesn't exist try again!`}
    }
    else{
        try{
            //change query to delete!!!!!!!!!!!!
            const [rows] = await db.execute(`INSERT INTO ownership (VIN,user_id)VALUES('${vin}','${user_id}');`)
            return {'error':false,'msg':`${username} is now an owner of car with VIN ${vin}!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}

exports.rentCar = async (vin,username)=>{
    const db = await connection
    const vinExists = await getCar(vin)
    const userExists = await getPassword(username)
    if(!vinExists){
        return {'error':true,'msg':`VIN: ${vin} is not registered in the system`}
    }
    else if(!userExists){
        return {'error':true,'msg':`USER: ${username} does not exist!`}
    }
    else{
        try{
            const [rows] = await db.execute(`INSERT INTO rentals (VIN,user_id)VALUES('${vin}','${user_id}');`)
            return {'error':false,'msg':`Car with VIN: ${vin} rented to ${username} successfully!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }

}

exports.returnCar = async (vin)=>{
    const db = await connection
    //GET USERID FROM USEREXISTS!!!!
    const vinExists = await getCar(vin)
    if(!vinExists){
        return {'error':true,'msg':`VIN: ${vin} doesn't exist try again!`}
    }
    else{
        try{
            //change query to delete!!!!!!!!!!!!
            const [rows] = await db.execute(`INSERT INTO ownership (VIN,user_id)VALUES('${vin}','${user_id}');`)
            return {'error':false,'msg':`${username} is now an owner of car with VIN ${vin}!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}


//tricky ones for now
exports.removeUser = async (username)=>{

}

exports.removeCar = async (vin)=>{

}

getPassword = async (username)=>{
    const db = await connection
    const [rows] = await db.execute(`SELECT * FROM users WHERE username='${username}'`)
    if(rows[0]){ return rows[0]['password']}
    else{return false}
}

getCar = async (vin)=>{

}

