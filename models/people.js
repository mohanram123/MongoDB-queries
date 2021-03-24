const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');

// using array unique plugin
const peopleSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    places:[{
        type:String,
        required:true,
        unique:true
    }],
    favNumbers:[{
        type:Number,
        required:true,
        unique:true
    }]
},{
    timestamps:true
});

peopleSchema.plugin(arrayUniquePlugin);

const people = mongoose.model('people',peopleSchema);

module.exports = people;

