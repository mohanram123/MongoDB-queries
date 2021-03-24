const express = require('express');
const peopleRoute = express.Router();

const people = require('../models/people');

peopleRoute
.post('/',async(req,res)=>{
    try{
        const {name,places,favNumbers} = req.body;
        const doc = new people({name,places,favNumbers});
        await doc.save();
        res.json(doc);
    } catch(e){
        res.status(500).json({error:e});    
    }
})

.put('/places',async(req,res)=>{
    try{
        const {name,places} = req.body;
        const result = await people.updateOne({name:name},{$push:{places:{$each:places}}});
        res.status(200).json(result);
    } catch(e){
        res.status(500).json({error:e}); 
    }
})

.put('/numbers',async(req,res)=>{
    try{
        const {name,favNumbers} = req.body;
        const result = await people.updateOne({name:name},{$push:{favNumbers:{$each:favNumbers}}});
        res.status(200).json(result);
    } catch(e){
        res.status(500).json({error:e}); 
    }
})

module.exports = peopleRoute;