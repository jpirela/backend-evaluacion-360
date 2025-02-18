// users/models/UserLog.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  loginAt: { type: Date, required: true },
  logoutAt: { type: Date },
  ip: { type: String, required: true },
  hostname: { type: String, required: true },
  userAgent: { type: String },
  browser: { type: String },
  browserVersion: { type: String },
  operatingSystem: { type: String },
});

module.exports = (conn) => conn.model('UserLog', UserLogSchema, 'users_log');
