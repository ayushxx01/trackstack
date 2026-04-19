const cold = require("../models/coldMailModel");
const asyncHandler = require("express-async-handler");
const app = require("../models/appModel");
const createColdMail = asyncHandler(async(req,res)=>{

    const appl = await app.findOne({
        _id: req.params.applicationId,
        userId: req.user.id
    });

    if(!appl){
        res.status(400);
        throw new Error("Unable to access");
    }
    const cm = await cold.create({
        userId: req.user.id,
        applicationId: req.params.applicationId,
        ...req.body
    });

    if (!cm){
        res.status(400);
        throw new Error('unable to create cold mail');
    }

    res.status(201).json({message: "created", mail: cm});
});

const fetchColds = asyncHandler(async(req,res)=>{
    const {company,replied} = req.query;
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {userId: req.user.id}
    if(company){
        filter.company = company
    }
    if(replied){
        if(replied === "true"){
            filter.replied = true
        } else if(replied === "false"){
            filter.replied = false
        } else {
            res.status(400);
            throw new Error("Invalid replied value, must be 'true' or 'false'");
        }
    }


    const colds = await cold.find(filter).sort({createdAt: -1}).skip(skip).limit(limit);
    if(!colds){
        res.status(400);
        throw new Error("no cold mails yet")
    }

    res.status(200).json(colds);
});

const fetchCold = asyncHandler(async(req,res)=>{
    const appId = req.params.id
      console.log("looking for:", appId, "userId:", req.user.id) 
    const coldi = await cold.findOne({_id: appId, userId: req.user.id});
    console.log("found:", coldi)
    res.status(200).json(coldi);

});

const deleteCold = asyncHandler(async(req,res)=>{
    const appId = req.params.id
    const coldi = await cold.findOneAndDelete({_id: appId, userId: req.user.id});

    if(!coldi){
        res.status(400);
        throw new Error("Unable to fetch")
    }

    res.status(200).json(coldi);

});

const updateCold = asyncHandler(async(req,res)=> {
    const appId = req.params.id
    const coldi = await cold.findOneAndUpdate({_id: appId, userId: req.user.id}, req.body, {new: true, runValidators: true});

    if(!coldi){
        res.status(400);
        throw new Error("Unable to fetch")
    }

    res.status(200).json(coldi);
});

const updateColdStatus = asyncHandler(async(req,res)=>{
    const appId = req.params.id
    const {replied} = req.body;
    if(replied === undefined){
        res.status(400);
        throw new Error("No status provided")
    }
    const coldi = await cold.findOneAndUpdate({_id: appId, userId: req.user.id}, {replied}, {returnDocument: 'after', runValidators: true});

    if(!coldi){
        res.status(400);
        throw new Error("Unable to fetch")
    }

    res.status(200).json(coldi);
});

module.exports = {
    createColdMail,
    fetchColds,
    fetchCold,
    deleteCold,
    updateCold,
    updateColdStatus
};