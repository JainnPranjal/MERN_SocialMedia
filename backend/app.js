const express =require('express');
const app=express();
const cookieparser =require("cookie-parser");
// const bodyParser= require('body-parser')
const cors = require('cors');
const morgan = require('morgan');



// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL /origin
    credentials: true, // Allow credentials (cookies, etc.  to be sent
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));


if(process.env.NODE_ENV !=="production"){
    require('dotenv').config({path:'backend/config/.env'});
}

//using middlewares
app.use(express.json( {limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb" ,extended:true}));
app.use(cookieparser());
app.use(morgan('dev'));

//importing routes
const post =require("./routes/post");
const user =require("./routes/user");

//using routes
app.use("/api/v1",post);
app.use("/api/v1",user);


module.exports=app;