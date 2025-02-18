// api/models/Evaluation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, default: Date.now },
    questions: [
      {
        question: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comments: { type: String, default: "" },
      },
    ],
    averageScore: { type: Number, default: 0 },
    status: { type: String, enum: ["Pendiente", "Completada"], default: "Pendiente" },
},
  { timestamps: true }
);

module.exports = (conn) => conn.model('Feedback', FeedbackSchema, 'feedback');