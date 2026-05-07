const express = require("express");
const bodyParser = require("body-parser");
const { procesarComando } = require("./bot");

const app = express();
app.use(bodyParser.json());
app.use(express.static("."));

app.post("/api", (req, res) => {
  const comando = req.body.comando;
  console.log("Comando recibido:", comando);

  procesarComando(comando, (respuesta) => {
    console.log("Respuesta bot:", respuesta);
    res.json({ respuesta });
  });
});

app.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});
