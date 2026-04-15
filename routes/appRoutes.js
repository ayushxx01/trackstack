const express = require("express");
const { createApp } = require("../controllers/appController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.use(validateToken); //we are using the validateToken middleware to protect all the routes in this router and only allow access to authenticated users, and we are using the user id from the token to perform operations like create, get, update, delete etc. on the applications in the database, and we can use this router to handle all the application related routes in the client side etc.
router.post("/create", createApp); //we are using the validateToken middleware to protect this route and only allow access to authenticated users, and we are using the createApp controller to create a new application in the database with the user id from the token and the data from the request body, and we can use this route to create a new application in the client side when the user submits the application form etc.

module.exports = router;