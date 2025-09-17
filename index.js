import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Ruta para pruebas (TikTok hará requests aquí)
app.post("/webhook", (req, res) => {
  console.log("Webhook recibido:", req.body);

  // Respuesta obligatoria a TikTok (200 OK)
  res.status(200).json({ status: "success", received: true });
});

// Ruta para verificar que está activo
app.get("/", (req, res) => {
  res.send("✅ Webhook activo y funcionando.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
