const express = require("express");
const app = express();
const port = 3000;

const path = require("path")
const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const index = require("./routes/index");

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
app.use("/", index)



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})