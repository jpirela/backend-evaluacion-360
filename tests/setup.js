// tests/setup.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("../auth/models/User");
const EmployeeModel = require("../api/models/Employee");

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_db");
  }

  // Limpia la base de datos antes de las pruebas
  await mongoose.connection.db.dropDatabase();

  const User = UserModel(mongoose.connection);
  const Employee = EmployeeModel(mongoose.connection);
  
  // Crear usuario Admin
  const hashedPassword = await bcrypt.hash("Candeloso001", 10);
  const admin = await User.create({
    first_name: "Jorge",
    last_name: "Pirela",
    email: "jorgepirelarivas@gmail.com",
    password: hashedPassword,
    id_number: 123456,
    role: "Admin",
  });

  // Crear usuario Employee
  const employeePassword = await bcrypt.hash("Empleado123", 10);
  const employee = await User.create({
    first_name: "Empleado",
    last_name: "Prueba",
    email: "employee@example.com",
    password: employeePassword,
    id_number: 654321,
    role: "Employee",
  });

  // Crear empleado en la colección de empleados
  const savedEmployee = await Employee.create({
    userId: employee._id,
    position: "Developer",
    department: "IT",
  });

  console.log("✅ Datos de prueba insertados correctamente.");
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});
