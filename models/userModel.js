const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: String,
    password: String,
    contact: Number,
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            quantity: { type: Number, default: 1 }
        }
    ],
    order: {
        type: Array,
        default: [],
    },
    address: String
})

module.exports = mongoose.model("user", userSchema);
