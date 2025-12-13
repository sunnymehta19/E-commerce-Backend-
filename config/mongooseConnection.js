const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        debug("MongoDB Connected");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    });

module.exports = mongoose.connection;
