const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: { type: String, required: true },
    passwordConfirm: { type: String, required: true },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true, enum: ["Car", "Bike", "Truck", "Bus", "Other"] }
});

userSchema.pre("save", function(next) {
    if (this.password !== this.passwordConfirm) {
        throw new Error("Passwords do not match");
    }
    this.passwordConfirm = undefined;
    next();
});

module.exports = mongoose.model("UserModel", userSchema);