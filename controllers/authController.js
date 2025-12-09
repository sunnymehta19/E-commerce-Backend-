const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        let { username, email, password, contact, address } = req.body;
        let user = await userModel.findOne({ email: email })
        if (user) {
            // return res.status(401).send("You already have an account, Please Login.")
            req.flash("error", "You already have an account. Please login.");
            return res.redirect("/");
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(400).send(err.message)
                }
                else {
                    let newUser = await userModel.create({
                        username,
                        email,
                        password: hash,
                        contact,
                        address
                    });

                    let token = generateToken(newUser)
                    res.cookie("token", token);
                    // return res.status(201).send("user created successfully");
                    return res.redirect("/shop");
                }
            })
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
}

const loginUser = async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email })
    if (!user) {
        req.flash("error", "Incorrect email or password");
        return res.redirect("/login");

    } else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                // return res.status(200).send("You can login");
                return res.redirect("/shop");

            } else {
                req.flash("error", "Incorrect email or password");
                return res.redirect("/login");
            }
        })
    }
}

const logOut = (req, res) => {
    res.cookie("token", "");
    res.redirect("/")
}


module.exports.logOut = logOut;
module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;

