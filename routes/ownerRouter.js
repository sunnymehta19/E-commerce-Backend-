const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const isOwner = require("../middlewares/isOwner");
const bcrypt = require("bcrypt");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {


        try {
            let owners = await ownerModel.find();
            if (owners.length > 0) {
                return res.status(503).send("Owner already exists");
            }
            let { username, email, password } = req.body;

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        return res.status(400).send(err.message)
                    }
                    else {
                        let createdOwner = await ownerModel.create({
                            username,
                            email,
                            password: hash
                        });

                        res.status(201).send(createdOwner);
                    }
                })
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).send("Internal server error");
        }

    });
}


router.get("/login", (req, res) => {
    let error = req.flash("error");
    res.render("ownerLogin", { error });
});


router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    let owner = await ownerModel.findOne({ email });
    if (!owner) {
        req.flash("error", "Invalid admin credentials");
        return res.redirect("/owner/login");
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
        req.flash("error", "Invalid admin credentials");
        return res.redirect("/owner/login");
    }

    req.session.owner = owner;
    res.redirect("/owner/admin");
});


router.get("/admin", isOwner, async (req, res) => {
    let success = req.flash("success");
    let totalProducts = await productModel.countDocuments();
    let totalUsers = await userModel.countDocuments();
    let totalOrders = 0;
    let pendingOrders = 0;

    let users = await userModel.find({});

    users.forEach(u => {
        if (u.order && u.order.length > 0) {
            totalOrders += u.order.length;

            u.order.forEach(o => {
                if (o.status === "Processing" || o.status === "Pending") {
                    pendingOrders++;
                }
            });
        }
    });

    res.render("ownerDashboard", { 
        success,
        totalProducts,
        totalUsers,
        totalOrders,
        pendingOrders
    });
});





router.get("/logout", (req, res) => {
    req.session.owner = null;
    res.redirect("/owner/login");
});



router.get("/dashboard", isOwner, async (req, res) => {
    const totalProducts = await productModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const pendingOrders = await userModel.aggregate([
        { $unwind: "$order" },
        { $match: { "order.status": "Processing" } }
    ]).then(r => r.length);

    res.render("adminDashboard", {
        totalProducts,
        totalUsers,
        pendingOrders
    });
});


// ADMIN ORDERS PAGE
router.get("/orders", isOwner, async (req, res) => {
    try {
        let users = await userModel.find().populate("order.items.product");

        let allOrders = [];

        users.forEach(user => {
            user.order.forEach(o => {
                allOrders.push({
                    user: user.username,
                    email: user.email,
                    items: o.items,
                    amountPaid: o.amountPaid,
                    status: o.status,
                    orderId: o._id,
                    date: o.date
                });
            });
        });

        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.render("admin/adminOrders", { allOrders });

    } catch (err) {
        res.send(err.message);
    }
});


//update orders
router.post("/orders/admin/update/:orderId", isOwner, async (req, res) => {
    try {
        const { status } = req.body;

        // Find the user containing the order
        let user = await userModel.findOne({ "order._id": req.params.orderId });
        if (!user) return res.send("Order not found");

        // Update order status
        user.order.forEach(o => {
            if (o._id.toString() === req.params.orderId) {
                o.status = status;
            }
        });

        await user.save();
        req.flash("success", "Order updated successfully!");
        res.redirect("/owner/orders");

    } catch (err) {
        res.send(err.message);
    }
});




// SHOW CREATE PRODUCT PAGE
router.get("/create-product", isOwner, (req, res) => {
    let success = req.flash("success");
    res.render("createProduct", { success });
});

// SHOW EDIT PRODUCT PAGE (redirects to correct product route)
router.get("/edit-product/:id", isOwner, async (req, res) => {
    let product = await productModel.findById(req.params.id);
    res.render("editProduct", { product });
});




module.exports = router;
