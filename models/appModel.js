const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true
    },
    companyName: {
        type: String,
        required: true,
        index: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "Under Review", "Interview", "Rejected", "Accepted"],
        default: "Applied",
        required: true,
        index: true
    },
    appliedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    deadlineDate: {
        type: Date,
        required: true,
        index: true
    },
    location: {
        type: String,
        
    },
    jobLink: {
        type: String,
       
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true
});





module.exports = mongoose.model("App", appSchema);