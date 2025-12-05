const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel")

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(503).send("Service Unavailable! Already have owner")
        }
        else{
            let {username, email, password} = req.body;
            let createdOwner = await ownerModel.create({
                username,
                email,
                password
            })
            res.status(201).send(createdOwner)
        }
    })
}


router.get("/", (req, res) => {
    res.send("I am ownerRouter");
});





module.exports = router;

