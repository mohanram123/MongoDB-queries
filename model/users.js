const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    regNo:{
        type: Number,
        unique: true,
        required:true
    },
    attendance:{
        type: [{
            reportingDate: Date, // can specify "unique:true" to avoid removal of duplicates
            entry: String,
            workDone: String
        }],
        required:true
    }
});

const user = mongoose.model('users',userSchema);

module.exports = user;