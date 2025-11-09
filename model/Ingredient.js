const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    tname:{
        type:String
    },
    price:{
        type:Number
    },
    image:{
        type:String
    }
},{ timestamps : true });
module.exports = mongoose.model('Ingredient',ingredientSchema);