const express = require('express');
const email1 = require('../models/email');
const emailRoute = express.Router();

emailRoute
.post('/',async(req,res)=>{
    try{
        const {name,password,email} = req.body;
        const result = new email1({name,password,email})
        let op = await result.save();
        res.json({result:op});
    } catch(e){
        res.status(500).json({error:e})
    }
})

.get('/',async(req,res)=>{
    try{
        const {email} = req.body;
        const result = await email1.findOne({email:email});
        res.json(result);
    } catch(e){
        console.log(e)
        res.status(500).json({error:e})
    }
})

module.exports = emailRoute;