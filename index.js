const express = require('express');
const app = express();
require('./db');
const user = require('./model/users');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/', async (req,res)=>{
    try{
        const {name,college,attendance,regNo} = req.body;
        const doc = new user({name,college,attendance,regNo});
        await doc.save();
        res.sendStatus(204);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

// run this route once to remove duplicates
app.get('/replace', async (req,res)=>{
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
        res.sendStatus(500);
    }
})

// update based on query === entry || workdone
// ps: Remove duplicates before updating records GET: /replace
app.put('/',async (req,res)=>{
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
        res.sendStatus(500);
    }
})

// get attendance of all users
app.get('/attendance',async (req,res)=>{
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
        console.log(e);
        res.sendStatus(500);
    }
})


app.listen(5001,()=>{
    console.log("Listening to port 5001");
})


