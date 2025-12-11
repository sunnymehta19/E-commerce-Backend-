const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    quantity: { type: Number, required: true }
}, { _id: false }); 


const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    paymentId: String,
    amountPaid: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Processing" }
});


const userSchema = new mongoose.Schema({
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

    order: [orderSchema], 

    address: String
});

module.exports = mongoose.model("user", userSchema);
