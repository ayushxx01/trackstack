const mongoose = require("mongoose");


const coldMailSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'App'
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,
        index: true
    },
    emailedOn: {
        type: Date,
        default: Date.now,
        required: true,
       
    },
    replied: {
        type: Boolean,
        default: false,
        index : true
    },
    platform: {
        type: String,
        default: "Email",
        required: true
    },
    notes: {
        type: String
    }
});


module.exports = mongoose.model("ColdMail", coldMailSchema);