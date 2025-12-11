const ownerModel = require("../models/ownerModel");

module.exports = async function isOwner(req, res, next) {
    try {
        if (!req.session.owner) {
            req.flash("error", "You must be logged in as admin");
            return res.redirect("/owner/login");
        }

        const owner = await ownerModel.findById(req.session.owner._id);
        if (!owner) {
            return res.redirect("/owner/login");
        }

        req.owner = owner;

        next();
    } catch (err) {
        res.send(err.message);
    }
};
