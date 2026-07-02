const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
    req.user = null;

    const tokenCookie = req.cookies?.token;

    if (!tokenCookie) {
        return next();
    }

    const token = tokenCookie;

    const user = getUser(token);

    if (user) {
        req.user = user;
    }

    next();
}

function restrictTo(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.redirect("/login");
        }

        if (!roles.includes(req.user.role)) {
            return res.end("Unauthorized");
        }

        next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};