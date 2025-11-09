const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/dbs');
const { errorHandler } = require('./util/errorHandler');
const cookieParser = require('cookie-parser');

const userRouter = require('./router/User');
const pizzaRouter = require('./router/Pizza');
const orderRouter = require('./router/Order');
const Limiter = require('./util/rateLimitter');

const app = express();

dotenv.config();

//  connecting the database
connectDB();

// parse the express json object
app.use(express.json());

// cookie parser
app.use(cookieParser());

// allow the cors policy
app.use(cors({
    origin: "http://localhost:3000",  
    credentials: true 
}));

// rate limitter
app.use(Limiter);

// all routers
app.use('/user',userRouter);
app.use('/pizza',pizzaRouter);
app.use('/order',orderRouter);


// global error handler
app.use(errorHandler);


const port = process.env.PORT;
app.listen(port,() =>{
    console.log(`Server is listening to ${port}`);
});