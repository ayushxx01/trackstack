const express = require("express");
const router = express.Router();
const {createColdMail, fetchColds, fetchCold, deleteCold, updateCold, updateColdStatus} = require("../controllers/coldMailController");
const validateToken = require("../middleware/validateToken");
const {createMailSchema, updateMailSchema} = require("../validators/mailValidator");
const validate = require("../middleware/validate");

router.use(validateToken);
router.post("/:applicationId", validate(createMailSchema), createColdMail);
router.get("/", fetchColds);
router.get("/:id", fetchCold);
router.delete("/:id", deleteCold);
router.put("/:id", validate(updateMailSchema), updateCold);
router.patch("/:id/status", updateColdStatus);

module.exports = router;