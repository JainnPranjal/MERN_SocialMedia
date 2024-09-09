/// ! Middleware to Fetch Token from Cookies ///
// authentication to rely on cookies rather than the Authorization header, 

const User= require("../models/User");
const jwt= require("jsonwebtoken");

exports.isAuthenticated = async (req,res,next)=>{
    try {

        // Extract the token from cookies
    const {token} = req.cookies;//token can be accessed from cookies with cookieparser

    if(!token){
        return res.status(401).json({
            message:"please login first",
        });
    }

    // Verify the token
    const decoded =await jwt.verify(token ,process.env.JWT_SECRET);

    req.user =await User.findById(decoded._id);

    if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // Move to the next middleware or route handler
    next();
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
    
};



///using the token from the Authorization header in the loadUser function///
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// exports.isAuthenticated = async (req, res, next) => {
//   try {
//     // Extract the token from the Authorization header
//     const authHeader = req.header('Authorization');

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         message: "Please login first",
//       });
//     }

//     // Remove 'Bearer ' from the token string
//     const token = authHeader.split(' ')[1];

//     // Verify the token
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);

//     // Find the user by ID stored in the token
//     req.user = await User.findById(decoded._id);

//     if (!req.user) {
//       return res.status(401).json({
//         message: 'User not found, authorization denied',
//       });
//     }

//     // Move to the next middleware or route handler
//     next();
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


// Key Points:
// Token Extraction: This middleware extracts the token from the Authorization header instead of cookies, which aligns with how you're sending the token from your frontend (loadUser function).
// Bearer Token: The middleware checks for the Bearer prefix in the Authorization header and properly extracts the token.
// Error Handling: It has error handling to manage situations where the token is missing or invalid, or the user is not found in the database.

// Frontend Consideration
// Make sure that when you refresh the page, the token is being properly loaded from localStorage or sessionStorage and passed in the Authorization header as shown in your loadUser function.