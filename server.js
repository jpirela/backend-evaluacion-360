const express = require("express");
const mongoose = require("mongoose"); // ✅ Agregar esta línea
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectUsersDB, connectEvaluationsDB } = require("./config/database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(bodyParser.json());

const usersDB = process.env.NODE_ENV === "test" ? mongoose.connection : connectUsersDB();
const evaluationsDB = process.env.NODE_ENV === "test" ? mongoose.connection : connectEvaluationsDB();

app.use((req, res, next) => {
  req.db = req.path.startsWith("/api/auth") ? usersDB : evaluationsDB;
  next();
});

const authRoutes = require("./auth/routes/authRoutes.js");
const apiRoutes = require("./api/routes/apiRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// ✅ Evitar iniciar el servidor en modo de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
