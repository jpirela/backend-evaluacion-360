// config/database.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectEvaluationsDB = () => {
  const connString = `${process.env.MONGODB_URI}/evaluations?retryWrites=true&w=majority`;
  return mongoose.createConnection(connString);
};

const connectUsersDB = () => {
  const connString = `${process.env.MONGODB_URI}/users?retryWrites=true&w=majority`;
  return mongoose.createConnection(connString);
};

module.exports = { connectEvaluationsDB, connectUsersDB };
