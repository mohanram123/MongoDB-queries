const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
const lodash = require('lodash');

const attendanceSchema = new mongoose.Schema({
    reportingDate:{
        type: Date,
        required: true
    },
    entry: String,
    workDone: String
})

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
        required:true,
        unique: true
    },
    attendance:{
        type: [attendanceSchema],
        required:true
    }
},{
    timestamps:true

});

// function for validating attendance and works for all documents - each document will contain unique dates and uniqueness wont be maintained across the docs
function attendanceValidator( attendance ){
    let unique = [];
    let dates = lodash.map(attendance,'reportingDate');
    let found = true;
    dates.forEach(ele => {
        let dt = new Date(ele);
        let dtstr = dt.getUTCDate() + '-' + dt.getUTCMonth() + '-' + dt.getUTCFullYear();
        if(unique.includes(dtstr)){
            found = false;
        } else {
            unique.push(dtstr);
        }
    })
    return found;
}
//validating schema
userSchema.path('attendance').validate((value) => attendanceValidator(value),'Reporting date must be unique')

// Unique dates can be added individually and the validation is the same
userSchema.pre('save',function beforeSave() {
    var user = this;
    if( !attendanceValidator(user.attendance) ){
        return new Error('Reporting date must be unique');
    }
})

const user = mongoose.model('users',userSchema);

module.exports = user;