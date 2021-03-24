const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-sequence')(mongoose);
var mongoose_delete = require('mongoose-delete');

const {Types: {Long}} = mongoose;

// using array unique plugin
const studentSchema = new mongoose.Schema({
    _id:{
        type:Number
    },
    name:{
        type: String,
        required: true
    },
    college:{
        type:String,
        required:true
    },
    fav:{
        type:Long
    }
},{ 
    _id:false,
    timestamps:true
});

studentSchema.plugin(AutoIncrement);
studentSchema.plugin(mongoose_delete,{deletedBy:true,deletedAt:true});

const student = mongoose.model('student',studentSchema);

module.exports = student;

