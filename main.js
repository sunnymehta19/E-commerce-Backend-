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

app.get("/", (req, res) => {
    res.send("this is main")
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})