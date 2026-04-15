const express = require("express");
const {registerUser, loginUser, getUser} = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/", validateToken, getUser); //we are using the validateToken middleware to protect this route and only allow access to authenticated users, and we are using the getUser controller to get the user details from the token and send it back to the client, and we can use this route to get the user details in the client side and display it in the dashboard or profile page etc.

module.exports = router;