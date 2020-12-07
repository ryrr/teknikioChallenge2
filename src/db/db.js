var mysql = require('mysql2/promise');
const util = require('../utility/util.js')
const config = require('../../config.js')

const connection =  mysql.createConnection(config.db);




exports.register = async (username,hashedPass)=>{
    const db = await connection
    const userExists = await getPassword(username,db)
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
    const hash = await getPassword(username,db)
    if(hash){
        let isVerified = await util.verifyPassword(password,hash)
        if(isVerified){return true}
        else{return false}
    }   
    else{
        return false
    }
}

exports.addCar = async (vin,carname,requestingUser)=>{
    const db = await connection
    const vinExists = await getCar(vin,db)
    const user_id = await getUserId(requestingUser,db)

    if(vinExists){ return {'error':true,'msg':`VIN: ${vin} is already registered`}}
    
    else{
        try{
            const [rows] = await db.execute(`INSERT INTO cars (VIN,name)VALUES('${vin}','${carname}');`)
            const ownershipUpdate = await db.execute(`INSERT INTO ownership (VIN,user_id)VALUES('${vin}','${user_id}');`)
            return {'error':false,'msg':`${carname} registered successfully!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}

//no authentication required for this project so all users are essentially admins
//in these routes


exports.addOwner = async (vin, username,requestingUser)=>{
    const db = await connection
    const user_id = await getUserId(username,db)
    const owner = await isOwner(user_id,vin,db) 
    const vinExists = await getCar(vin,db)


    if(username===requestingUser){ return {'error':true,'msg':`can't award yourself ownership of a car`}}
    else if(!user_id){             return {'error':true,'msg':`username: ${username} doesn't exist try again!`}}
    else if(owner){                return {'error':true,'msg':`username: ${username} is already an owner!`}}
    else if(!vinExists){           return {'error':true,'msg':`VIN: ${vin} is not registered in the system`}}

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

exports.removeOwner = async (vin,username,requestingUser)=>{
    const db = await connection
    const user_id = await getUserId(username,db)
    const owner = await isOwner(user_id,vin,db)

    if(username===requestingUser){ return {'error':true,'msg':`cant remove ownership from yourself`}}
    else if(!user_id){             return {'error':true,'msg':`username: ${username} doesn't exist try again!`}}
    else if(!owner){               return {'error':true,'msg':`username: ${username} is not an owner of the car with VIN: ${vin}`}}
    
    else{
        try{
            const [rows] = await db.execute(`DELETE from ownership WHERE user_id='${user_id}' and VIN='${vin}'`)
            return {'error':false,'msg':`${username} is no longer an owner of car with VIN ${vin}!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}

exports.rentCar = async (vin,username,requestingUser)=>{
    const db = await connection
    const vinExists = await getCar(vin,db)
    const user_id = await getUserId(username,db)

    if(username===requestingUser){ return {'error':true,'msg':`can't rent a car to yourself`}}
    else if(!vinExists){           return {'error':true,'msg':`VIN: ${vin} is not registered in the system`}}
    else if(!user_id){             return {'error':true,'msg':`USER: ${username} does not exist!`}}
 
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
    const vinExists = await getRental(vin,db)
    if(!vinExists){ return {'error':true,'msg':`Rental records of car with VIN: ${vin} don't exist, try again!`}}

    else{
        try{
            const [rows] = await db.execute(`DELETE from rentals WHERE VIN='${vin}'`)
            return {'error':false,'msg':`You successfully returned car with VIN: ${vin}!`}
        }catch(e){
            console.log(e)
            return {'error':true,'msg':e}
        }
    }
}


//not implemented for now
exports.removeUser = async (username)=>{

}

exports.removeCar = async (vin)=>{

}



getPassword = async (username,connection)=>{
    const db = connection
    const [rows] = await db.execute(`SELECT * FROM users WHERE username='${username}'`)
    if(rows[0]){ return rows[0]['password']}
    else{return false}
}

getCar = async (vin,connection)=>{
    const db = connection
    const [rows] = await db.execute(`SELECT * FROM cars WHERE VIN='${vin}'`)
    if(rows[0]){ return rows[0]['name']}
    else{return false}
}

getUserId = async(username,connection)=>{
    const db = connection
    const [rows] = await db.execute(`SELECT * FROM users WHERE username='${username}'`)
    if(rows[0]){ return rows[0]['id']}
    else{return false}
}

isOwner = async (user_id,vin,connection)=>{
    const db = connection
    const [rows] = await db.execute(`SELECT * FROM ownership WHERE user_id='${user_id}' and VIN='${vin}'`)
    if(rows[0]){ return rows[0]['id']}
    else{return false}
}

getRental = async (vin,connection)=>{
    const db = connection
    const [rows] = await db.execute(`SELECT * FROM rentals WHERE VIN='${vin}'`)
    if(rows[0]){ return rows[0]['user_id']}
    else{return false}
}