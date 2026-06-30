const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateShortUrl(req, res) {
    const body = req.body;

    if (!body?.url) {
        return res.status(400).send("URL is required");
    }

    const shortID = shortid.generate();

    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
    });

    // Fetch all URLs from the database
    const allUrls = await URL.find({});

    return res.render("home", {
        id: shortID,
        urls: allUrls,
    });
}

module.exports = {
    handleGenerateShortUrl,
};