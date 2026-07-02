const express = require("express");
const { handleGenerateShortUrl } = require("../controllers/url");
const { checkForAuthentication, restrictTo } = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    checkForAuthentication,
    restrictTo(["NORMAL", "ADMIN"]),
    handleGenerateShortUrl
);

module.exports = router;