const { asyncHandler, APIError } = require('../util/errorHandler');
const logger = require('../util/logger');
const Cart = require('../model/CustomPizza');
const Order = require('../model/Order');
const sendMail = require('../util/sendEmail');

const OrderPizza = asyncHandler( async (req,res) => {
        const {Phone, deliveryAddress } = req.body;
        
        const userID = req.user._id;
    
        const cartItems = await Cart.find({ userID : userID }).populate("pizzaID");

        if (!cartItems.length) {
            throw new APIError(404,"Your cart is empty!");
        }

        const orderItems = cartItems.map((item) => ({
            pizzaID: item.pizzaID?._id || null,
            customData: item.customData || {},
            quantity: item.quantity,
        }));

        const totalPrice = cartItems.reduce((acc, item) => {
            const price = item.customData?.price || item.pizzaID?.price || 0;
            return acc + price * item.quantity;
        }, 0);
    
        const order = await Order.create({
            userID,
            items: orderItems,
            totalPrice,
            deliveryAddress,
            Phone
        });

        const message = `
            <h2>🍕 Order Confirmation</h2>
            <p>Thank you ${req.user.username} for ordering with PizzaApp!</p>
            <p>Your Order ID: <b>${order._id}</b></p>
            <p>Total Amount: ₹${totalPrice}</p>
            <p>Phone number: ${Phone}</p>
            <p>Delivery Address: ${deliveryAddress}</p>
            <p>We’ll notify you when your pizza is out for delivery 🚚</p>
        `;

        await sendMail(req.user.email, "Your Pizza Order Confirmation 🍕", message);
        logger.info({message: "Order confirmed and email sent!" ,userId:req.user._id,username:req.user.username});

        return res.status(201).json({
            message: "Order placed successfully!",
            order,
        });

});

const getOrders = asyncHandler(async (req,res) => {

    const orders = await Order.find({userID:req.user._id}).populate('items.pizzaID').sort({createdAt:-1});
    
    return res.status(200).json({
        success:true,
        message:"data fetched",
        orders
    });
});

module.exports = {  OrderPizza , getOrders};