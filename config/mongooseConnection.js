const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose")
require("dotenv").config();

mongoose.connect(`${process.env.MONGODB_URI}/bagVerse`)

.then(() => {
    debug("connected");
})
.catch((err) => {
    debug(err);
});

module.exports = mongoose.connection;
