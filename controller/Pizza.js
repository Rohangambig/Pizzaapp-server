const Pizza = require('../model/Pizza');
const Ingredient = require('../model/Ingredient');
const { asyncHandler, APIError } = require('../util/errorHandler');
const customPizza = require('../model/CustomPizza');
const logger = require('../util/logger');

const getAllPizza = asyncHandler(async (req,res) => {
    const pizza = await Pizza.find();
    if(!pizza || pizza.length === 0) 
        throw new APIError(401,"Error in fetching pizza");
    return res.status(200).json({
        success:true,
        message:"Fetched pizza",
        pizza
    });
});

const getAllIngredient = asyncHandler ( async (req,res) => {
    const ingredient = await Ingredient.find();
    if(!ingredient || ingredient.length === 0) 
        throw new APIError(404,"Unable to fetch ingridient");

    return res.status(200).json({
        success:true,
        message:"fetched ingredient",
        ingredient
    });
});

const CustomPizza = asyncHandler( async (req,res) => {
    const { data, pizzaId } = req.body;
    if(!data && !pizzaId) throw new APIError(404,'cannot find cart data');
    await customPizza.create({
        userID:req.user._id,
        pizzaID:pizzaId,
        customData:data
    });

    if(data) logger.info({message:"user build their pizza",userId:req.user._id, username:req.user.username});
    else logger.info({message:"user added cart item",pizzaId:pizzaId,userId:req.user._id,username:req.user.username});

    return res.status(200).json({success:true,
        message:"data stored..! check cart page please."
    });

});

const getCart = asyncHandler(async (req,res) => {
  
    const cart = await  customPizza.find({userID:req.user._id}).populate('pizzaID');
    return res.status(200).json({
        success:true,
        message:"fetched cart items",
        cart
    });
});

const deleteCart = asyncHandler(async (req,res) => {
    const {id} = req.body;
    if(!id) throw new APIError(404,"cart id not getting from frontend");
    const deletedCart = await customPizza.findByIdAndDelete(id);
    if(!deletedCart) throw new APIError(402,"Error in deleting cart item");

    logger.info({message:'remove the cart item',cartId:id,userId:req.user._id,username:req.user.username});

    return res.status(200).json({
        success:true,
        message:"cart item deleted"
    });
});

const increaseQuantity = asyncHandler(async (req,res) => {
    const { id } = req.body;
    if(!id) throw new APIError(404,"cart id not found");

    const cartItem = await customPizza.findById(id);
    cartItem.quantity += 1;

    await cartItem.save();
    return res.status(200).json({
        success:true,
        message:"increased cart item"
    });
});

const decreaseQuantity = asyncHandler(async (req,res) => {
    const { id } = req.body;
    if(!id) throw new APIError(404,"cart id not found");

    const cartItem = await customPizza.findById(id);
    cartItem.quantity -= 1;
    
    await cartItem.save();
    return res.status(200).json({
        success:true,
        message:"increased cart item"
    });
});

module.exports = { getAllPizza ,  getAllIngredient,CustomPizza , getCart, deleteCart,increaseQuantity,decreaseQuantity};