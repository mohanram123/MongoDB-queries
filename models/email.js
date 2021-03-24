const mongoose = require('mongoose');
let mongooseHidden = require('mongoose-hidden')()

// using array unique plugin
const emailSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
        hide:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
},{ 
    timestamps:true
});

emailSchema.plugin(mongooseHidden)

const email1 = mongoose.model('email',emailSchema);

module.exports = email1;

