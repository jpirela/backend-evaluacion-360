// api/models/Enployee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null }, 
},
  { timestamps: true }
);

module.exports = (conn) => conn.model('Employee', EmployeeSchema, 'employee');