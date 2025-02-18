// api/routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");
const auth = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");

// Solo Admins y Managers pueden ver todos los empleados
router.get("/employees", auth, authorize(["Admin", "Manager"]), apiController.getEmployees);

// Cualquier usuario autenticado puede ver su propia información
router.get("/employees/:id", auth, apiController.getEmployeeById);

// Solo Managers y Admins pueden crear evaluaciones
router.post("/evaluations", auth, authorize(["Admin", "Manager"]), apiController.createEvaluation);

// Los empleados pueden ver sus propias evaluaciones
router.get("/evaluations/:id", auth, apiController.getEvaluationById);

// Solo Managers pueden actualizar evaluaciones
router.put("/evaluations/:id", auth, authorize(["Manager"]), apiController.updateEvaluation);

// Los empleados pueden ver sus propias evaluaciones
router.get("/evaluations/employee/:id", auth, apiController.getEvaluationsByEmployee);

// Los empleados pueden enviar feedback
router.post("/feedback", auth, apiController.submitFeedback);

// Los empleados pueden ver feedback de sus evaluaciones
router.get("/feedback/evaluation/:id", auth, apiController.getFeedbackByEvaluation);

// Solo Admins y Managers pueden generar reportes
router.get("/reports/employee/:id", auth, authorize(["Admin", "Manager"]), apiController.generateReport);

module.exports = router;
