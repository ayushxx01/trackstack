const express = require("express");
const { createApp, deleteApp, updateApp, fetchApps, fetchApp, updateStatus, upcomingDeadlines} = require("../controllers/appController");
const validateToken = require("../middleware/validateToken");
const validate = require("../middleware/validate");
const { createAppSchema, updateAppSchema } = require("../validators/noteValidator");
const router = express.Router();

router.use(validateToken); //we are using the validateToken middleware to protect all the routes in this router and only allow access to authenticated users, and we are using the user id from the token to perform operations like create, get, update, delete etc. on the applications in the database, and we can use this router to handle all the application related routes in the client side etc.

router.post("/create", validate(createAppSchema) ,createApp); //we are using the validateToken middleware to protect this route and only allow access to authenticated users, and we are using the createApp controller to create a new application in the database with the user id from the token and the data from the request body, and we can use this route to create a new application in the client side when the user submits the application form etc.
router.delete("/:id", deleteApp); //we are using the validateToken middleware to protect this route and only allow access to authenticated users, and we are using the deleteApp controller to delete an application from the database with the user id from the token and the application id from the request params, and we can use this route to delete an application in the client side when the user clicks on the delete button etc.
router.put("/update/:id", validate(updateAppSchema), updateApp);
router.get("/fetch", fetchApps);
router.get("/fetch/:id", fetchApp);
router.patch("/updateStatus/:id", updateStatus);
router.get("/deadline", upcomingDeadlines);

//we are using the validateToken middleware to protect this route and only allow access to authenticated users, and we are using the updateApp controller to update an application in the database with the user id from the token and the application id from the request params, and we can use this route to update an application in the client side when the user clicks on the edit button and submits the updated application form etc.
module.exports = router;