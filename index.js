const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connection");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const { checkForAuthentication, restrictTo } = require("./middleware/auth");

const urlRoutes = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const UserRoutes = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => {
        console.log("Connected to MongoDB");
    });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL"]), urlRoutes);
app.use("/", staticRouter);
app.use("/user", UserRoutes);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    console.log("Short ID:", shortId);

    const entry = await URL.findOneAndUpdate(
        { shortId: shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        {
            returnDocument: "after",
        }
    );


    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});