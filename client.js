function renderProductos(data) {
  const cont = document.getElementById("productos");
  cont.innerHTML = "";
  if (!data || data.length === 0) {
    cont.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }
  data.forEach(prod => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <p>Categoría: ${prod.categoria}</p>
      <button onclick="editarProducto(${prod.id})">Editar</button>
      <button onclick="eliminarProducto(${prod.id})">Eliminar</button>
    `;
    cont.appendChild(card);
  });
}

function buscarProducto() {
  const termino = document.getElementById("search").value.trim();
  let comando;
  // Si el usuario escribe "agregar precio X", no anteponemos "buscar"
  if (termino.toLowerCase().startsWith("agregar precio")) {
    comando = termino;
  } else {
    comando = "buscar " + termino;
  }

  fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comando })
  })
  .then(res => res.json())
  .then(data => {
    try {
      const rows = data.respuesta.split("\n").filter(x=>x).map(line => {
        const [id,nombre,precio,categoria] = line.split("|");
        return { id, nombre, precio, categoria };
      });
      renderProductos(rows);
    } catch(e) {
      document.getElementById("productos").innerHTML = "<p>" + data.respuesta + "</p>";
    }
  });
}

function editarProducto(id) {
  alert("Editar producto ID " + id);
  // Aquí podés abrir un modal con inputs para editar nombre, precio y categoría
}

function eliminarProducto(id) {
  fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comando: "eliminar producto " + id })
  })
  .then(res => res.json())
  .then(data => alert(data.respuesta));
}

function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const categoria = document.getElementById("categoria").value;
  fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comando: `agregar producto ${nombre} ${precio} ${categoria}` })
  })
  .then(res => res.json())
  .then(data => alert(data.respuesta));
}
