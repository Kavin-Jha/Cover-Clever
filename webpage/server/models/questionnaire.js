const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionnaireSchema = new Schema({
    age: Number,
    income: Number,
    coverage: String,
    doctor: String,
    prescriptions: String,
})

const QuestionnaireModel = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = QuestionnaireModel;