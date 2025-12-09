const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");


router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("createAccount", { error });
});

router.get("/login", (req, res) => {
    let error = req.flash("error");
    res.render("login", { error });
});

router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find({});
    let success = req.flash("success");
    res.render("shop", { products, success });
});


//Cart
router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    let existing = user.cart.find(item => 
        item.product.toString() === req.params.productid
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        user.cart.push({ product: req.params.productid, quantity: 1 });
    }

    await user.save();
    req.flash("success", "Added to Cart");
    res.redirect("/shop");
});


//Cart
router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
    res.render("cart", { user });
});



//Account Route
router.get("/account", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    res.render("account", { user })
})


//Edit Address
router.get("/edit-address", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render("editAddress", { user });
});

//Edit Address
router.post("/edit-address", isLoggedIn, async (req, res) => {
    const { address } = req.body;

    await userModel.findOneAndUpdate(
        { email: req.user.email },
        { address: address }
    );

    req.flash("success", "Address updated successfully!");
    res.redirect("/account");
});


//Edit Profile
router.get("/edit-profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render("editProfile", { user });
});


//Edit Profile post
router.post("/edit-profile", isLoggedIn, async (req, res) => {
    const { username, contact } = req.body;

    await userModel.findOneAndUpdate(
        { email: req.user.email },
        { username, contact }
    );

    req.flash("success", "Profile updated successfully!");
    res.redirect("/account");
});


//Order Page
router.get("/orders", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
        .populate("order.product");

    res.render("orders", { user });
});


//Checkout Page
router.get("/checkout", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
        .populate("cart.product");

    res.render("checkout", { user });
});


//Payment Page
router.get("/payment", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
        .populate("cart.product");

    res.render("payment", { user });
});




module.exports = router;