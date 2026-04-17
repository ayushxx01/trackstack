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
        companyName,
        position,
        status,
        coldMailStatus,
        appliedDate,
        location: req.body.location || "",
        jobLink: req.body.jobLink || "",
        notes: req.body.notes || ""
    });

    res.status(201).json(appl);
});

const deleteApp = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const appl = await app.findOneAndDelete({_id: id, userId: req.user.id});
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
        //allowedKyes are in string format so that we can check if the key is present in the request body or not
        // we are using includes method of array which returns true if the key is present in the request body and false if it is not present in the request body
        const allowedKeys = ["companyName", "position", "status", "coldMailStatus", "appliedDate", "location", "jobLink", "notes"];
        const allowedFields = {};

        Object.keys(req.body).forEach(key => {
            if(allowedKeys.includes(key)){
                allowedFields[key] = req.body[key];
            }
        });

        const appl = await app.findOneAndUpdate({_id: req.params.id, userId: req.user.id}, allowedFields, { new: true , runValidators:true});

        if(!appl){
            res.status(404);
            throw new Error("Application not found");
        }
        
        res.status(200).json(appl);
});

const fetchApps = asyncHandler(async(req,res)=>{
    const apps = await app.find({userId: req.user.id}).sort({createdAt: -1});
// always returns annarray , even if no application returns []
    res.status(200).json(apps);
});

const fetchApp = asyncHandler(async(req,res)=>{
    const appl = await app.findOne({_id: req.params.id, userId: req.user.id});
    if(!appl){
        res.status(404);
        throw new Error("Application not found");
    }
    res.status(200).json(appl);
});


const updateStatus = asyncHandler(async(req,res)=>{
const {status} = req.body;
if(!status){
    res.status(400);
    throw new Error("No status set");
}
const id = req.params.id;

const appl = await app.findOneAndUpdate({_id: id, userId: req.user.id},
     {status},
    {new: true, runValidators: true});
if(!appl){
    res.status(404);
    throw new Error("Application not found")
}
    res.status(200).json(appl);
});




module.exports = { createApp, deleteApp, updateApp, fetchApps, fetchApp , updateStatus};
