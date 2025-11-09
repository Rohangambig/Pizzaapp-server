const mongoose = require('mongoose');

const BuildSchema = new mongoose.Schema({
    userID:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    pizzaID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pizza'
    },
    customData:{
        name:{ type:String},
        image:{type:String},
        price:{ type:Number},
        ingredients:{ type : [String,]}
    },
    quantity:{
        type:Number,
        default:1
    }
});

module.exports = mongoose.model('CustomPizza',BuildSchema);