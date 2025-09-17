import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";

const app = express();
app.use(bodyParser.json());

// Configuración de Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

// ID de tu Google Sheet (copia de la URL)
const SPREADSHEET_ID = "TU_SPREADSHEET_ID_AQUI";

// Ruta para recibir webhooks de TikTok
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    // Mapear los datos al formato que definimos
    const row = [
      new Date().toISOString(),             // Fecha
      data.campaign_name || "N/A",          // Nombre Campaña
      data.results || 0,                    // Resultados
      data.cpa || 0,                        // CPA
      data.ctr || 0,                        // CTR
      data.cost_per_payment || 0,           // Costos por pagos iniciados
      data.cpm || 0                         // CPM
    ];

    // Guardar en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja1!A:G",
      valueInputOption: "RAW",
      resource: { values: [row] }
    });

    res.status(200).send("Webhook recibido y datos guardados en Sheets ✅");
  } catch (err) {
    console.error("Error guardando en Sheets:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Puerto Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


