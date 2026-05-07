const { runSQLSync } = require("./db");

function procesarComando(input, callback) {
  const comando = input.toLowerCase().trim().split(" ");

  // Buscar por nombre o categoría
  if (comando[0] === "buscar") {
    const termino = comando.slice(1).join(" ");
    const out = runSQLSync(`SELECT id || '|' || nombre || '|' || precio || '|' || categoria FROM productos WHERE nombre LIKE '%${termino}%' OR categoria LIKE '%${termino}%'`);
    callback(out || "No se encontraron resultados");
    return;
  }

  // Listar productos
  if (comando[0] === "listar" && comando[1] === "productos") {
    const out = runSQLSync("SELECT id || '|' || nombre || '|' || precio || '|' || categoria FROM productos");
    callback(out || "No hay productos");
    return;
  }

  // Eliminar producto
  if (comando[0] === "eliminar" && comando[1] === "producto") {
    const id = comando[2];
    runSQLSync(`DELETE FROM productos WHERE id=${id}`);
    callback("Producto eliminado ID " + id);
    return;
  }

  // Agregar producto: ejemplo "agregar producto Remera 20000 Hombre"
  if (comando[0] === "agregar" && comando[1] === "producto") {
    const nombre = comando[2];
    const precio = comando[3];
    const categoria = comando[4] || "general";
    runSQLSync(`INSERT INTO productos(nombre, precio, categoria) VALUES('${nombre}', ${precio}, '${categoria}')`);
    callback(`Producto agregado: ${nombre} ($${precio}) en categoría ${categoria}`);
    return;
  }

  // Aumentar precios: ejemplo "agregar precio 2"
  if (comando[0] === "agregar" && comando[1] === "precio") {
    const porcentaje = parseFloat(comando[2]);
    if (isNaN(porcentaje)) {
      callback("Porcentaje inválido. Ejemplo: agregar precio 2");
      return;
    }
    runSQLSync(`UPDATE productos SET precio = ROUND(precio * (1 + ${porcentaje}/100), 2)`);
    callback(`Todos los precios aumentados en ${porcentaje}%`);
    return;
  }

  callback("Comando no reconocido");
}

module.exports = { procesarComando };
