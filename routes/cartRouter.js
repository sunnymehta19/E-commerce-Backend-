const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const userModel = require("../models/userModel");


//for increasing quantity 
router.post("/increase/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    let item = user.cart.find(i => 
        i.product.toString() === req.params.productid
    );

    if (item) {
        item.quantity += 1;
    }

    await user.save();
    res.redirect("/cart");
})

//for decreasing quantity
router.post("/decrease/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let item = user.cart.find(i => 
        i.product.toString() === req.params.productid
    );

    if (item && item.quantity > 1){ 
        item.quantity -= 1;
    }
    
    await user.save();
    res.redirect("/cart");
});


//for removing
router.post("/remove/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    user.cart = user.cart.filter(
        i => i.product.toString() !== req.params.productid
    );

    await user.save();
    res.redirect("/cart");
});


module.exports = router;