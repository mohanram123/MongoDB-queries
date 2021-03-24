const express = require('express');
const attendance = express.Router();
const user = require('../models/users');

// run this route once to remove duplicates
attendance
.get('/replace', async (req,res)=>{
    try{
        // remove duplicates based on dates
        const doc2 = await user.aggregate([
            {
              $addFields: {
                attendance: {
                  $reduce: {
                    input: "$attendance",
                    initialValue: [],
                    in: {
                      $concatArrays: [
                        "$$value",
                        {
                          $cond: [
                            {
                              $in: [
                                "$$this.reportingDate",
                                "$$value.reportingDate"
                              ]
                            },
                            [],
                            [
                              "$$this"
                            ]
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          ]);
          
       // Drop all collections  
       const del =  await user.deleteMany({});
       if(del){
           // insert unique docs
           const success = await user.insertMany(doc2);
           // return unique docs after successful insert
           if(success) return res.status(200).json(success);
           else return res.sendStatus(500);
       } else {
           return res.sendStatus(500);
       }
    } catch(e){
        res.status(500).json({error:e});
    }
})

// post docs in collection
.post('/', async (req,res)=>{
    try{
        const {name,college,attendance,regNo} = req.body;

        const doc = new user({name,college,attendance,regNo});

        await doc.save();

        res.sendStatus(204);
    } catch(e){
        res.status(500).json({error:e});
    }
})

// update based on query === entry || workdone
// ps: Remove duplicates before updating records GET: /replace
.put('/',async (req,res)=>{
    try{
        const job = req.query.task;
        if(job === "entry"){
            const {reportingDate, entry, regNo} = req.body;
            
            const query = { regNo: regNo,"attendance.reportingDate":reportingDate};
            const updateDocument = {
                 "attendance.$.entry":entry 
              }
            const result = await user.updateOne(query,updateDocument);
            return res.status(200).json(result);
        }
        if(job === "workdone"){
            const {reportingDate, workdone, regNo} = req.body;
            const query = { regNo: regNo,"attendance.reportingDate":reportingDate};
            const updateDocument = {
                 "attendance.$.workDone":workdone 
              }
            const result = await user.updateOne(query,updateDocument);
            return res.status(200).json(result);
        }
    } catch(e){
        res.status(500).json({error:e});
    }
})

// insert attendance for a particular user
.put('/:id/atd',(req,res)=>{
    try{
      const regNo = req.params.id;
      const {reportingDate,entry,workDone} = req.body;
      user.findOne({regNo:regNo})
       .then( (usr) => {
          usr.attendance.push({reportingDate,entry,workDone});
          usr.save()
          .catch( err => res.send(err));
       })
      
    } catch(e){
        res.status(500).json({error:e});
    }
})

// get attendance of all users
.get('/attendance',async (req,res)=>{
    try{
        var pipeline = [{$unwind: '$attendance'},  
                {$group: {
                    _id: '$regNo',
                    "Present": {
                        "$sum": {
                            "$cond": [
                                 {"$eq": ["$attendance.entry", "Yes"]},
                                  1, 
                                  0]
                        }
                     },
                     "Absent": {
                        "$sum": {
                            "$cond": [
                                 {"$eq": ["$attendance.entry", "No"]},
                                   1,
                                   0]
                        }
                    }}}];
        const doc = await user.aggregate(pipeline)     
        res.status(200).json(doc)
    } catch(e){
        res.status(500).json({error:e});
    }
})


module.exports = attendance;
