const appls = require("../models/appModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const getStats = asyncHandler(async(req,res)=> {
    const userId = req.user.id;

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

    res.status(200).json({totalApplications: total,
        byStatus: statusMap,
        byLocation: locationMap
    });
});

module.exports = getStats;