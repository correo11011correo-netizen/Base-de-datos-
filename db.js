const { execSync } = require("child_process");

function runSQLSync(query) {
  console.log("SQL>", query);
  try {
    const out = execSync(`sqlite3 tienda.db "${query}"`).toString();
    console.log("SQL out>", out);
    return out;
  } catch (err) {
    console.error("Error SQL:", err.message);
    return "";
  }
}

// Recrear tabla productos con columna categoria
runSQLSync("DROP TABLE IF EXISTS productos");
runSQLSync("CREATE TABLE productos(id INTEGER PRIMARY KEY, nombre TEXT, precio REAL, categoria TEXT)");
runSQLSync("CREATE TABLE IF NOT EXISTS clientes(id INTEGER PRIMARY KEY, nombre TEXT)");

// Insertar datos iniciales
const productos = [
  ["Coca-Cola", 1200, "gaseosas"],
  ["Pepsi", 1100, "gaseosas"],
  ["Agua Mineral", 800, "bebidas"],
  ["Jugo de Naranja", 900, "jugos"],
  ["Galletitas Oreo", 950, "galletitas"],
  ["Alfajor Jorgito", 700, "alfajores"],
  ["Yerba Mate", 2500, "almacen"],
  ["Azúcar", 1500, "almacen"],
  ["Pan", 1000, "panificados"]
];
productos.forEach(([nombre, precio, categoria]) => {
  runSQLSync(`INSERT INTO productos(nombre, precio, categoria) VALUES('${nombre}', ${precio}, '${categoria}')`);
});

module.exports = { runSQLSync };
