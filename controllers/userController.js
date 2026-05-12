const express = require("express");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const hashedPassword = await Bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    if(user){
        res.status(201).json({Message: `User created: ${username}`})
    }
    else{
        res.status(400);
        throw new Error("Unable to create user");
    }
});

const loginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await Bcrypt.compare(password, user.password))){
        const token = jwt.sign({
            username: user.username,
            email: user.email,
            id: user._id //we are using this id in the validateToken middleware to verify the user and give access to the protected routes, and we get this id from the user model which is created by mongoose and is unique for each user, and we can use this id to identify the user in the database and perform operations like get, update, delete etc.
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30m"
        });
        if(token){
            res.status(200).json({token});
        }
    }
    else{
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

const getUser = asyncHandler(async(req, res)=>{
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getUser
}
 