const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    firstName: String,
    lastName: String,
    password: String,
    age: Number,
    incomeLevel: Number,
    expectedCost: Number,
    medicalConditions: { type: Object, default: {} },
    desiredBenefits: { type: Object, default: {} },
    insurancePreferenceExplanation: String,
    // preferences: { type: Object, default: {} }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;