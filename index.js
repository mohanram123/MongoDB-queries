const express = require('express');
const app = express();
require('./db');

const attendance = require('./routes/attendanceRouter');
const emailRoute = require('./routes/emailRouter');
const peopleRoute = require('./routes/peopleRouter');
const studentRoute = require('./routes/studentRouter');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',attendance);
app.use('/people',peopleRoute);
app.use('/email',emailRoute);
app.use('/students',studentRoute);






app.listen(5001,()=>{
    console.log("Listening to port 5001");
})


