const express = require('express');
const {userRegister, userLogin,logoutUser} = require('../controller/User.js');
const route = express.Router();

route.post('/register',userRegister);
route.post('/login',userLogin);
route.post('/logout',logoutUser);

module.exports = route;