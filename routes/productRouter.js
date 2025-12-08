const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const productModel = require("../models/productModel");

router.post("/create", upload.single("avatar"), async (req, res) => {
    try {
        let {name, price, discount, bgcolor, panelcolor, textcolor} = req.body;
    let CreatedProduct = await productModel.create({
        name,
        image: req.file.buffer,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    });
    req.flash("success", "Product Created Successfully.");
    res.redirect("/owner/admin");

    } catch (err) {
        res.send(err.message);
        
    }
});

module.exports = router;

