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

const deleteApp = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const appl = await app.findById(id);
    if(!appl){
        res.status(404);
        throw new Error("Application not found");
    }

    res.status(200).json(appl);
});

const updateApp = asyncHandler(async(req,res)=> {
    const { companyName,
 position,
 status,
 coldMailStatus,
 appliedDate,
 location,
 jobLink,
notes} = req.body;

        const allowFields = [companyName, position, status, coldMailStatus, appliedDate, location, jobLink, notes];
        const allowedFields = {};

        Object.keys(req.body).forEach(key => {
            if(allowFields.includes(req.body.key)){
                allowedFields[key] = req.body.key;
            }
        });

        const appl = await app.findByIdAndUpdate(req.params.id, allowedFields, { new: true , runValidators:true});

        if(!appl){
            res.status(404);
            throw new Error("Application not found");
        }
        
        res.status(200).json(appl);
});

const fetchApps = asyncHandler(async(req,res)=>{
    const apps = await app.find({userId: req.user.id}).sort({createdAt: -1});
    if(!apps){
        res.status(404);
        throw new Error("No applications found");
    }
    res.status(200).json(apps);
});


module.exports = { createApp, deleteApp, updateApp, fetchApps };
