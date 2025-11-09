const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    },
    authToken:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true
    },
    refreshToken:{
        type:String,
        required:true
    },
    expiredAt:{
        type:Date,
        required: true,
        expires: 0
    }
});

module.exports = mongoose.model('Refresh',refreshTokenSchema);