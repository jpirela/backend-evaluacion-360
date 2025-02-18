// api/controllers/apiController.js
const EmployeeModel = require("../models/Employee");
const EvaluationModel = require("../models/Evaluation");
const FeedbackModel = require("../models/Feedback");

// Obtener lista de empleados
const getEmployees = async (req, res) => {
  try {
    const Employee = EmployeeModel(req.db);
    const employees = await Employee.find().populate("userId", "name email");

    if (!employees || employees.length === 0) {
      console.warn("⚠ No hay empleados registrados en la base de datos.");
      return res.status(404).json({ message: "No employees found" });
    }

    console.log("✅ Empleados encontrados:", employees.length);
    res.status(200).json(employees);
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error.message);
    res.status(500).json({ message: "Error al obtener empleados", error: error.message });
  }
};

// Obtener detalles de un empleado por ID
const getEmployeeById = async (req, res) => {
  try {
    const Employee = EmployeeModel(req.db);
    const { id } = req.params;
    const employee = await Employee.findById(id).populate("userId", "name email");

    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("❌ Error al obtener empleado:", error.message);
    res.status(500).json({ message: "Error al obtener empleado", error: error.message });
  }
};

// Crear una nueva evaluación
const createEvaluation = async (req, res) => {
  try {
    const Evaluation = EvaluationModel(req.db);
    const { employeeId, evaluatorId, questions } = req.body;

    if (!employeeId || !evaluatorId || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Datos incompletos para la evaluación" });
    }

    const newEvaluation = new Evaluation({
      employeeId,
      evaluatorId,
      questions,
      averageScore: 0,
      status: "Pendiente",
    });

    await newEvaluation.save();
    res.status(201).json({ message: "Evaluación creada exitosamente", evaluation: newEvaluation });
  } catch (error) {
    console.error("❌ Error al crear evaluación:", error.message);
    res.status(500).json({ message: "Error al crear evaluación", error: error.message });
  }
};

// Obtener detalles de una evaluación
const getEvaluationById = async (req, res) => {
  try {
    const Evaluation = EvaluationModel(req.db);
    const { id } = req.params;
    const evaluation = await Evaluation.findById(id).populate("employeeId evaluatorId", "name");

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluación no encontrada" });
    }

    res.status(200).json(evaluation);
  } catch (error) {
    console.error("❌ Error al obtener evaluación:", error.message);
    res.status(500).json({ message: "Error al obtener evaluación", error: error.message });
  }
};

// Enviar feedback para una evaluación
const submitFeedback = async (req, res) => {
  try {
    const Feedback = FeedbackModel(req.db);
    const { evaluationId, employeeId, feedback } = req.body;

    if (!evaluationId || !employeeId || !feedback) {
      return res.status(400).json({ message: "Datos incompletos para el feedback" });
    }

    const newFeedback = new Feedback({ evaluationId, employeeId, feedback });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback enviado exitosamente", feedback: newFeedback });
  } catch (error) {
    console.error("❌ Error al enviar feedback:", error.message);
    res.status(500).json({ message: "Error al enviar feedback", error: error.message });
  }
};

// Generar reporte de evaluación para un empleado
const generateReport = async (req, res) => {
  try {
    const Evaluation = EvaluationModel(req.db);
    const { id } = req.params;
    const evaluations = await Evaluation.find({ employeeId: id });

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: "No hay evaluaciones para generar el reporte" });
    }

    const report = evaluations.map((evaluation) => ({
      evaluator: evaluation.evaluatorId,
      date: evaluation.date,
      averageScore: evaluation.averageScore,
      status: evaluation.status,
    }));

    res.status(200).json({ message: "Reporte generado", report });
  } catch (error) {
    console.error("❌ Error al generar reporte:", error.message);
    res.status(500).json({ message: "Error al generar reporte", error: error.message });
  }
};

// Actualizar una evaluación
const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { questions, status } = req.body;
    const Evaluation = EvaluationModel(req.db);

    const evaluation = await Evaluation.findById(id);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluación no encontrada" });
    }

    if (questions) evaluation.questions = questions;
    if (status) evaluation.status = status;

    const totalScore = evaluation.questions.reduce((acc, q) => acc + q.rating, 0);
    evaluation.averageScore = totalScore / evaluation.questions.length;

    await evaluation.save();
    res.status(200).json({ message: "Evaluación actualizada", evaluation });
  } catch (error) {
    console.error("❌ Error al actualizar evaluación:", error.message);
    res.status(500).json({ message: "Error al actualizar evaluación", error: error.message });
  }
};

// Obtener evaluaciones de un empleado
const getEvaluationsByEmployee = async (req, res) => {
  try {
    const Evaluation = EvaluationModel(req.db);
    const { id } = req.params;

    const evaluations = await Evaluation.find({ employeeId: id });

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: "No hay evaluaciones para este empleado" });
    }

    res.status(200).json(evaluations);
  } catch (error) {
    console.error("❌ Error al obtener evaluaciones:", error.message);
    res.status(500).json({ message: "Error al obtener evaluaciones", error: error.message });
  }
};

// Obtener feedback de una evaluación
const getFeedbackByEvaluation = async (req, res) => {
  try {
    const Feedback = FeedbackModel(req.db);
    const { id } = req.params;

    const feedbacks = await Feedback.find({ evaluationId: id }).populate("employeeId", "name");

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No hay feedback para esta evaluación" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("❌ Error al obtener feedback:", error.message);
    res.status(500).json({ message: "Error al obtener feedback", error: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEvaluation,
  getEvaluationById,
  submitFeedback,
  generateReport,
  updateEvaluation,
  getEvaluationsByEmployee,
  getFeedbackByEvaluation,
};
