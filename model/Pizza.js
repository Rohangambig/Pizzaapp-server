const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    price : {
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    description:{
        type:String
    },
    ingredients:{
        type:Array
    },
    topping:{
        type:Array
    }
},{timestamps : true});

module.exports = mongoose.model('Pizza',pizzaSchema);