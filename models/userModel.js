const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email : String,
    password : String,
    contact: Number,
    cart : {
        type: Array,
        default: [],
    },
    order: {
        type: Array,
        default: [],
    },
    picture: String
})

module.exports = mongoose.model("user", userSchema);
