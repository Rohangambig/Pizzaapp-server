const express = require('express');
const {  getAllPizza , getAllIngredient,CustomPizza, getCart, deleteCart,increaseQuantity,decreaseQuantity} = require('../controller/Pizza');
const { authMiddleware } = require('../middleware/authMiddleware');

const route = express.Router();

route.get('/get-pizza',getAllPizza);
route.get('/get-ingredient',getAllIngredient);
route.post('/custom-pizza',authMiddleware,CustomPizza);
route.get('/get-cart',authMiddleware,getCart);
route.delete('/delete-cart',authMiddleware,deleteCart);
route.patch('/incre-quantity',authMiddleware,increaseQuantity);
route.patch('/decre-quantity',authMiddleware,decreaseQuantity);
module.exports = route;