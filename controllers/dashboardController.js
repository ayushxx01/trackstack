const appls = require("../models/appModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const client = require("../config/redisClient");

const getStats = asyncHandler(async(req,res)=> {
    const userId = req.user.id;
    const cacheKey = `stats:${userId}`

    const cached = await client.get(cacheKey);
    if(cached){
        res.status(200).json(JSON.parse(cached));
        console.log("cached")
        return;
    }
    console.log("cached miss")
    const total = await appls.countDocuments({userId});

    const byStatus = await appls.aggregate([
        {$match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
        {$group: {_id:"$status", count: {$sum: 1}}},
        // {$group: {_id: "$location", count: {$sum: 1}}}
    ]);

    const byLocation = await appls.aggregate([
        {$match: {userId: new mongoose.Types.ObjectId(req.user.id)}
    },
    {$group: {_id: "$location", count: {$sum: 1}}}
    ]);

    const statusMap = {}
    byStatus.forEach(item=> {
        statusMap[item._id] = item.count;

    });
    const locationMap = {}
    byLocation.forEach(item=>{
        locationMap[item._id] = item.count
    })
    const response = {totalApplications: total, byStatus: statusMap, byLocation: locationMap};
    await client.set(cacheKey, JSON.stringify(response),{EX:300})
    res.status(200).json(response);
});

module.exports = getStats;