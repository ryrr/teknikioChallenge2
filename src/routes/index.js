const express = require("express")
const app = express()
const router = express.Router()
const db = require('../db/db.js')
const util = require('../utility/util.js')



//user

router.post("/register", async(req,res)=>{
    const username = req.body['username']
    const password = req.body['password']
    const hashedPassword = await util.hashPassword(password)
    const result = await db.register(username,hashedPassword)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})

router.post("/login", async(req,res)=>{
    const username = req.body['username']
    const password = req.body['password']
    const successfulLogin = await db.login(username,password)
    if(successfulLogin){res.send(`${username} logged in!`)}
    else{res.send(`login failed!`)}
})

router.post("/add_car", async(req,res)=>{
    const vin = req.body['VIN']
    const carname = req.body['carname']
    const result = await db.addCar(vin,carname)
    console.log(result)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})

router.post("/add_owner", async(req,res)=>{
    const vin = req.body['VIN']
    const username = req.body['username']
    const result = await db.addOwner(vin,username)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})

router.post("/remove_owner", async(req,res)=>{
    const vin = req.body['VIN']
    const username = req.body['username']
    const result = await db.removeOwner(vin,username)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})

router.post("/rent_car", async(req,res)=>{
    const vin = req.body['VIN']
    const username = req.body['username']
    const result = await db.rentCar(vin,username)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})

//user-admin

router.post("/remove_car", async(req,res)=>{
    const vin = req.body['VIN']
    const result = await db.removeCar(vin)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})

router.post("/return_car", async(req,res)=>{
    const vin = req.body['VIN']
    const result = await db.returnCar(vin)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})


//admin

router.get("/remove_user",(req,res)=>{
    const username = req.body['username']
    const result = db.removeUser(vin)
    if(!result['error']){res.send(result['msg'])}
    else{res.send(result['msg'])}
})


module.exports = router