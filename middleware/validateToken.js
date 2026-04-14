const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");



const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401);
        throw new Error("Unauthorized, no token provided");
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; //we are attaching the decoded token to the request object so that we can access it in the protected routes and perform operations based on the user id and email etc.
        next();
    }
    catch(error){
        res.status(401);
        throw new Error("Unauthorized, invalid token");
    }
});

module.exports = validateToken;