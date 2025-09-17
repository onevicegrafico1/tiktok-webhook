import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";

// Inicializa Express
const app = express();
app.use(bodyParser.json());

// Configuración de Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// ID de tu Google Sheet (copiar de la URL de tu hoja de cálculo)
const SPREADSHEET_ID = "TU_SPREADSHEET_ID_AQUI";

// Ruta para recibir webhooks de TikTok
app.post("/webhook", async (req, res) => {
  console.log("Webhook recibido:", req.body);

  try {
    // Ejemplo: guardar client_key, event y create_time
    const { client_key, event, create_time, content } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja1!A:D", // Ajusta al nombre de tu pestaña y columnas
      valueInputOption: "RAW",
      requestBody: {
        values: [[new Date().toISOString(), client_key, event, create_time, content]],
      },
    });

    res.status(200).json({ status: "success", saved: true });
  } catch (error) {
    console.error("Error guardando en Google Sheets:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("✅ Webhook activo y funcionando con Google Sheets.");
});

// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

