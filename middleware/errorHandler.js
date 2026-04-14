const {constants} = require("../constants/constants");

const errorHandler = (err,req,res,next)=> {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode: 500; //if the status code is set and is not 200, use it. Otherwise, default to 500 (server error)

    switch(statusCode){
        case constants.NOT_FOUND: {
            res.json({
                title: "Not Found",
                message: err.message,
            });
        }
        break;
        case constants.FORBIDDEN: {
            res.json({
                title: "Forbidden",
                message: err.message
            });
        }
        break;
        case constants.SERVER_ERROR: {
            res.json({
                title: "Server error",
                message: err.message
            })
        }
        break;
        case constants.UNAUTHORISED: {
            res.json({
                title: "Unauthorized",
                message :err.message
            })
        }
        break;
        case constants.VALIDATION_ERROR: {
            res.json({
                title: "Validation error",
                message: err.message
            })
        }
        break;
        default: {
            res.json({
                title:"Server error",
                message: err.message    
            });
    }
}
}

module.exports = errorHandler;