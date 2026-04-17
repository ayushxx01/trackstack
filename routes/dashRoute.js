const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken");
const getStats = require("../controllers/dashboardController");


router.use(validateToken);
router.get("/", getStats);

module.exports = router;