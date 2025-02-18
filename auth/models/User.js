// users/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {type: String },
  last_name: {type: String },
  email: {type: String, required: true},
  password: {type: String, required: true},
  id_number: {type: Number, required: true},
  created_at: {type: Date, default: Date.now},
  authorized: {type: Boolean, default: true},
  role: {type: String, enum: ["Admin", "Manager", "Employee"], default: 'Employee' }
});

module.exports = (conn) => conn.model('User', UserSchema, 'users');