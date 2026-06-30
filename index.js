const express = require("express");
const { connectToMongoDB } = require("./connection");
const urlRoutes = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => {
        console.log("Connected to MongoDB");
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoutes);

app.get("/:shortId", async (req, res) => {
    const entry = await URL.findOneAndUpdate(
        { shortId: req.params.shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true }
    );

    console.log(entry);

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});