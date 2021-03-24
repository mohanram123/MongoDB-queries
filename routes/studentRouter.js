const express = require('express');
const student = require('../models/students');
const studentRoute = express.Router();

studentRoute
.post('/',async(req,res)=>{
    try{
        const {name,college,fav} = req.body;
        const doc = new student({name,college,fav});
        const result = await doc.save();
        res.json(result);       
    } catch(e){
        res.send(e);
    }
})

.get('/',async(req,res)=>{
    try{
        const result = await student.find({});
        res.json(result);
    } catch(e){
        res.send(e);
    }
})

.delete('/one',async(req,res)=>{
    try{
        const {id} = req.body;
        const result = await student.deleteOne({_id:id});
        res.json(result);
    } catch(e){
        res.send(e);
    }
})

.delete('/all',async(req,res)=>{
    try{
        const result = await student.delete({});
        student.counterReset('_id',(err)=>{
            if(err) console.log(err);
            console.log('Counter reset')
        })
        return res.json(result);
    } catch(e){
        res.send(e);
    }
})

module.exports = studentRoute;
