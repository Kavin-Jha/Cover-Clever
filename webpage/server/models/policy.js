const mongoose = require("mongoose");
const { Schema } = mongoose;

const policySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", unique: false },
  name: { type: String, required: true, unique: true },
  deductibles: { type: Schema.Types.Mixed, default: {} },
  benefits: { type: Schema.Types.Mixed, default: {} },
  score: { type: Number, default: 0 },
  preferences: { type: Schema.Types.Mixed, default: {} },
  comments: { type: Schema.Types.Mixed, default: {} }
});

const PolicyModel = mongoose.model("Policy", policySchema);

module.exports = PolicyModel;