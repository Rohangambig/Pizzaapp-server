const express = require('express');
const  { authMiddleware } = require('../middleware/authMiddleware');
const { OrderPizza , getOrders} = require('../controller/Order');
const router = express.Router();

router.post('/place-order',authMiddleware,OrderPizza);
router.get('/get-item',authMiddleware,getOrders);
module.exports = router;