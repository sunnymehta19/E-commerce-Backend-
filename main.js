const express = require("express");
const app = express();
const port = 3000;

const path = require("path")
const cookieParser = require("cookie-parser");
const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const userModel = require("./models/userModel")

const db = require("./config/mongooseConnection")

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/owner", ownerRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);



app.get("/account", (req, res) => {
    res.render("createAccount");

})

app.get("/login", (req, res) => {
    res.render("login");

})

app.get("/cart", (req, res) => {
    res.render("cart");

})

app.post("/create", async (req, res) => {
    let {username, email, password, contact} = req.body;
    let user = await userModel.create({
        username,
        contact,
        password,
        email,
    })

    res.send(user)

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})