const app = require("../models/appModel");
const asyncHandler = require("express-async-handler");

const createApp = asyncHandler(async(req,res)=>{

    const {companyName, position, status, coldMailStatus, appliedDate} = req.body;

    if(!companyName || !position || !status || !coldMailStatus || !appliedDate){
        res.status(400);
        throw new Error("Please fill all the required fields");
    }

    const appl = await app.create({
        userId: req.user.id,
        ...req.body
    });

    res.status(201).json(appl);
});



module.exports = { createApp };
