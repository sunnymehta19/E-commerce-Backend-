const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const productModel = require("../models/productModel");
const isOwner = require("../middlewares/isOwner");


router.get("/create", isOwner, (req, res) => {
    res.render("createProduct", {
        success: req.flash("success"),
        error: req.flash("error")
    });
});


router.post("/create", isOwner, upload.single("avatar"), async (req, res) => {
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
    res.redirect("/owner/create-product");

    } catch (err) {
        res.send(err.message);
        
    }
});


//See all product
router.get("/all", isOwner, async (req, res) => {
    try {
        let products = await productModel.find({});
        res.render("allProducts", { products });
    } catch (err) {
        res.send(err.message);
    }
});


//Delete Product
router.get("/delete/:id", isOwner, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        req.flash("success", "Product deleted successfully!");
        res.redirect("/product/all");
    } catch (err) {
        res.send(err.message);
    }
});


// EDIT PRODUCT FORM
router.get("/edit/:id", isOwner, async (req, res) => {
    let product = await productModel.findById(req.params.id);
    res.render("editProduct", { product });
});

// HANDLE EDIT PRODUCT
router.post("/edit/:id", isOwner, async (req, res) => {
    try {
        const name = req.body.name;

        const price = Number(req.body.price.replace(/,/g, ""));
        const discount = Number(req.body.discount.replace(/,/g, ""));

        const bgcolor = req.body.bgcolor;
        const panelcolor = req.body.panelcolor;
        const textcolor = req.body.textcolor;

        if (isNaN(price) || isNaN(discount)) {
            return res.status(400).send("Invalid price or discount format");
        }

        await productModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price,
                discount,
                bgcolor,
                panelcolor,
                textcolor
            },
            { new: true }
        );

        req.flash("success", "Product Updated Successfully!");
        return res.redirect("/product/all");

    } catch (err) {
        console.error("EDIT PRODUCT ERROR:", err.message);
        return res.status(500).send("Something went wrong while updating product");
    }
});




module.exports = router;

