const app = require("../models/appModel");
const asyncHandler = require("express-async-handler");

const createApp = asyncHandler(async(req,res)=>{

    const {companyName, position, status, coldMailStatus, appliedDate, deadlineDate} = req.body;

    const appl = await app.create({
        userId: req.user.id,
        companyName,
        position,
        status,
        coldMailStatus,
        appliedDate: appliedDate || Date.now(),
        deadlineDate,
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
    
        //allowedKeys are in string format so that we can check if the key is present in the request body or not
        // we are using includes method of array which returns true if the key is present in the request body and false if it is not present in the request body

        const appl = await app.findOneAndUpdate({_id: req.params.id, userId: req.user.id}, req.body, { new: true , runValidators:true});
        if(!appl){
            res.status(404);
            throw new Error("Application not found");
        }
        
        res.status(200).json(appl);
});

const fetchApps = asyncHandler(async(req,res)=>{
    const {status, companyName} = req.query;
    const filter = {userId: req.user.id};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    // filter.skip = skip;
    // filter.limit = limit; because skip and limit are not fields in the database, we cannot use them in the filter object, we have to use them in the query method of mongoose which is find method in this case, and we can chain the skip and limit methods to the find method to implement pagination, and we can use the page and limit query parameters to get the page number and limit from the client side, and we can set default values for page and limit if they are not provided in the query parameters, and we can calculate the skip value based on the page number and limit, and we can use the skip value to skip the documents in the database and get the desired page of results, and we can use the limit value to limit the number of documents returned in the response, and we can return the paginated results to the client side.
    // filter.page = page;
    if(status && !["Applied", "Under Review", "Interview", "Rejected", "Accepted"].includes(status)){
  res.status(400)
  throw new Error("Invalid status value")
}
    if(status){
        filter.status = status;
    }
    if(companyName){
        filter.companyName = {$regex: companyName, $options: "i"};
    }
    const appls = await app.find(filter).sort({createdAt: -1}).skip(skip).limit(limit);

   
    // always returns an array, even if no applications are found
    res.status(200).json({
        page,
        limit,
        result: appls.length,
        data: appls
    });
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

const upcomingDeadlines = asyncHandler(async(req,res)=>{
    const today = new Date();
    const deadline = parseInt(req.query.days) || 7;

    const apps = await app.find({
        userId: req.user.id,
        deadlineDate: {
            $gte: today,
            $lte: new Date(today.getTime() + deadline * 24 * 60 * 60 * 1000)
        }
    }).sort({deadlineDate: 1});


    if(!apps){
        res.status(404);
        throw new Error("No upcoming deadlines found or you have not applied to any jobs yet");
    }

    res.status(200).json(apps);
});

const bulkDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400)
    throw new Error("Please provide an array of ids")
  }

  const result = await app.deleteMany({
    _id: { $in: ids },
    userId: req.user.id
  })

  res.status(200).json({ deletedCount: result.deletedCount })
});


module.exports = { createApp, deleteApp, updateApp, fetchApps, fetchApp , updateStatus, upcomingDeadlines, bulkDelete};
