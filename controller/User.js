const logger = require('../util/logger');
const User = require('../model/User');
const { asyncHandler, APIError } = require('../util/errorHandler');
const bcrypt = require('bcrypt');
const Refresh = require('../model/RefreshToken');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../model/RefreshToken');

const userRegister = asyncHandler(async (req,res) =>{
    const {username,password,email} = req.body;
    if(!username || !password) 
        throw new APIError(404,"Please provide username and password");

    const isExists = await User.findOne({username : username});
    if(isExists)
        throw new APIError(402,"Username already exists");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    await User.create({ username, password : hashedPassword,email});
    return res.status(201).json({
        success:true,
        message:"user registered successfully..."
    });

});

const userLogin = asyncHandler( async (req,res) => {
    const { username, password } = req.body;
    if(!username || !password) 
        throw new APIError(404,"Please provide username and password");

    const user = await User.findOne({username});
    if(!user || user === null)
        throw new APIError(404,"please register the username and password");
    
    const isTrue = await bcrypt.compare(password,user.password);
    if(!isTrue) throw new APIError(402,"incorrect password");
    
    const token = jwt.sign({
        _id:user._id,
        username:user.username,
        email:user.email
    },process.env.JWT_SECRET,{ expiresIn : '1h'});

    const refreshToken = jwt.sign({
        _id:user._id,
        username:user.username,
        email:user.email
    },process.env.JWT_SECRET,{expiresIn:'7d'});

    logger.info({userId:user._id,username:user.username,message:"logged in"});

    await Refresh.create({
        userId:user._id,
        username:user.username,
        authToken:token,
        email:user.email,
        refreshToken:refreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("token",token,{
        maxAge: 1.5 * 60 * 60 * 1000,
        secure: true, 
        sameSite: 'strict' 
    });

    res.status(201).json({
        success:true,
        message:"successfully login",
        token
    });

});

const logoutUser = asyncHandler(async (req,res) => {
    const token = req.cookies.token;

    if(!token)  return res.status(200).json({
      success: true,
      message: "No active session"
    });

    await RefreshToken.deleteOne({authToken:token});
     res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });
     return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });

});

module.exports = {userRegister, userLogin,logoutUser} ;