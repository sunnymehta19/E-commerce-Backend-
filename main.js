const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


const path = require("path")
const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");


const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const index = require("./routes/index");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config()

const db = require("./config/mongooseConnection")

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    })
)
app.use(flash());
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/owner", ownerRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/", index)
app.use("/admin", adminRoutes);



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})