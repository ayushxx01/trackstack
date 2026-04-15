const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    companyName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "Under Review", "Interview", "Rejected", "Accepted"],
        default: "Applied",
        required: true
    },
    coldMailStatus: {
        type: String,
        enum: ["Not Sent", "Sent", "Replied"],
        default: "Not Sent",
        required: true
    },
    appliedDate: {
        type: Date,
        default: Date.now
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