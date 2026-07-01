const express = require("express");
const { handleGenerateShortUrl } = require("../controllers/url");
const { restrictToLoggedinUserOnly } = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    restrictToLoggedinUserOnly,
    handleGenerateShortUrl
);

module.exports = router;