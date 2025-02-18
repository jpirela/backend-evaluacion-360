// users/controllers/UserController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const UserLog = require('../models/UserLog');

process.env.SECRET_KEY = 'secret';

const getUserModel = (db) => {
  return User(db);
};

const getUserLogModel = (db) => {
  return UserLog(db);
};

exports.register = async (req, res) => {
  const User = getUserModel(req.db);
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    id_number: req.body.id_number,
    created_at: today,
    authorized: req.body.authorized,
    role: req.body.role,
  };

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const hash = await bcrypt.hash(req.body.password, 10);
      userData.password = hash;
      const newUser = await User.create(userData);
      res.json({ status: newUser.email + ' registered' });
    } else {
      res.status(400).json({ error: 'User already exists' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const User = getUserModel(req.db);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const payload = {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role, // Incluyendo el rol del usuario
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });

        res.json({ token });
      } else {
        res.status(400).json({ error: 'Password is incorrect' });
      }
    } else {
      res.status(400).json({ error: 'User does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.profile = async (req, res) => {
  const User = getUserModel(req.db);
  const UserLog = getUserLogModel(req.db);
  
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const user = await User.findById(decoded._id);
    if (user) {
      const userAgent = req.headers['user'];

      let browserName = "Unknown";
      let browserVersion = "Unknown";
      const browserMatches = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
      if (browserMatches) {
        browserName = browserMatches[1];
        browserVersion = browserMatches[2];
      }

      let operatingSystem = "Unknown";
      const osMatches = userAgent.match(/\(([^)]+)\)/);
      if (osMatches) {
        operatingSystem = osMatches[1];
      }

      const userLogData = {
        userId: user._id,
        loginAt: new Date(),
        ip: req.ip,
        hostname: req.hostname,
        userAgent: userAgent,
        browser: browserName,
        browserVersion: browserVersion,
        operatingSystem: operatingSystem
      };

      const newUserLog = new UserLog(userLogData);
      await newUserLog.save();

      res.json({
        user
      });
    } else {
      res.status(404).json({ error: 'User does not exist' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    const userLog = await UserLog.findOne({ userId: decoded._id, logoutAt: null });
    if (userLog) {
      userLog.logoutAt = new Date();
      await userLog.save();
    }
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
