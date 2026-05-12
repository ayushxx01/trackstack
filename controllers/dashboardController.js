const appls = require("../models/appModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const client = require("../config/redisClient");

const getStats = asyncHandler(async(req,res)=> {
    const userId = req.user.id;
    const cacheKey = `stats:${userId}`

    //checks if the stats for the user are present in the cache or not, if present then return the cached stats and if not present then fetch the stats from the database and store it in the cache for future requests, and return the stats to the client, and we can set an expiration time for the cache so that it will be automatically deleted after a certain time, and we can use the EX option of the set method to set the expiration time in seconds, and we can set it to 300 seconds which is 5 minutes, so that the stats will be updated every 5 minutes and we can ensure that the stats are not stale for too long, and we can also handle the case when there is an error while fetching the stats from the database or while setting the cache, and we can log the error and return a generic error message to the client.
    const cached = await client.get(cacheKey);
    if(cached){
        res.status(200).json(JSON.parse(cached));
        console.log("cached")
        return;
    }
    console.log("cached miss")
    // const total = await appls.countDocuments({userId: req.user.id});
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