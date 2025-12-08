const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel")

// console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("Service Unavailable! Already have owner")
        }
        else {
            let { username, email, password } = req.body;
            let createdOwner = await ownerModel.create({
                username,
                email,
                password
            })
            res.status(201).send(createdOwner)
        }
    })
}


router.get("/admin", (req, res) => {
    let success = req.flash("success")
    res.render("createProduct", { success });
});





module.exports = router;

