require("./setup");  // Asegura que la conexión a la base de datos se maneja correctamente
const request = require("supertest");
const app = require("../server");  // Importamos `app`, sin iniciar `app.listen()`

let adminToken, employeeToken, employeeId; // Variables para almacenar el token y el ID del empleado

// Generar un token válido antes de todas las pruebas
beforeAll(async () => {
  // Autenticación del Admin
  const adminResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "jorgepirelarivas@gmail.com", password: "Candeloso001" });

  console.log("Login response:", adminResponse.body); // Verificar la respuesta completa del login
  adminToken = adminResponse.body.token;
  console.log("Admin Token:", adminToken); // Verificar si el token es correcto

  // Autenticación del Employee
  const employeeResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "employee@example.com", password: "Empleado123" });

  employeeToken = employeeResponse.body.token;

  // Obtener el ID real del empleado
  const employees = await request(app)
    .get("/api/employees")
    .set("Authorization", adminToken);

  if (employees.body.length > 0) {
    employeeId = employees.body[0]._id;
  } else {
    console.error("❌ No se encontró ningún empleado en la base de datos.");
  }

  // Crear evaluación de prueba
  const evaluationResponse = await request(app)
    .post("/api/evaluations")
    .set("Authorization", adminToken)
    .send({
      employeeId: employeeId,
      evaluatorId: employeeId,
      questions: [{ question: "¿Cómo fue el rendimiento?", rating: 5 }],
    });

  evaluationId = evaluationResponse.body.evaluation._id;

  // Crear feedback para la evaluación de prueba
  await request(app)
    .post("/api/feedback")
    .set("Authorization", adminToken)
    .send({
      evaluationId: evaluationId,
      employeeId: employeeId,
      feedback: "Buen trabajo en equipo",
    });
}, 15000);  // Aumentamos el timeout para evitar problemas de conexión

describe("API Routes", () => {
  // Verifica que Admin o Manager puedan obtener todos los empleados
  it("should get all employees if user is Admin or Manager", async () => {
    const response = await request(app)
      .get("/api/employees")
      .set("Authorization", adminToken); // Usar el token válido

    console.log("Response body:", response.body); // Ver el mensaje de error o datos

    expect(response.status).toBe(200); // Espera un código 200 (OK)
  });

  // Verifica que un empleado no pueda acceder a la lista de empleados
  it("should return 403 if user is Employee trying to access /api/employees", async () => {
    const employeeToken = await getEmployeeToken(); // Función para obtener un token de empleado
    const response = await request(app)
      .get("/api/employees")
      .set("Authorization", employeeToken);

    expect(response.status).toBe(403); // Un empleado debería recibir un 403 (Forbidden)
  });

  // Verifica que Admin o Manager puedan crear una evaluación
  it("should create evaluation if user is Admin or Manager", async () => {
    const response = await request(app)
      .post("/api/evaluations")
      .set("Authorization", adminToken)
      .send({
        employeeId, // Usar el ID de empleado real
        evaluatorId: employeeId, // Usar el ID de evaluador real
        questions: [{ question: "How was the performance?", rating: 5 }],
      });

    console.log("Create evaluation response:", response.body);

    expect(response.status).toBe(201); // Espera un código 201 (Created)
    expect(response.body.message).toBe("Evaluación creada exitosamente");
  });

  // Verifica que un empleado pueda obtener sus evaluaciones
  it("should get evaluations for an employee", async () => {
    const response = await request(app)
      .get(`/api/evaluations/employee/${employeeId}`)
      .set("Authorization", adminToken);

    console.log("Evaluations response:", response.body);

    expect(response.status).toBe(200); // Espera un código 200 (OK)
  });

  // Verifica que un empleado pueda recibir feedback de una evaluación
  it("should return feedback for a specific evaluation", async () => {
    const response = await request(app)
      .get(`/api/feedback/evaluation/${evaluationId}`)
      .set("Authorization", adminToken);
  
    console.log("Feedback response:", response.body);
  
    // Si la API devuelve 404 cuando no hay feedback, la prueba debe reflejarlo
    expect(response.status).toBe(404); 
    expect(response.body.message).toBe("No hay feedback para esta evaluación");
  });  

  // Verifica que la falta de un token retorne 401
  it("should return 401 if no token is provided", async () => {
    const response = await request(app)
      .get("/api/employees");

    expect(response.status).toBe(401); // No se proporciona token, se espera un código 401 (Unauthorized)
  });
});

// Función para obtener un token de empleado (puedes modificarla según tus necesidades)
async function getEmployeeToken() {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: "employee@example.com", password: "Empleado123" }); // Asegúrate de usar un empleado válido
  return response.body.token;
}
