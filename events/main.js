import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/favorite", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "favorite.html"));
});

app.get("/ticket", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "ticket.html"));
});

app.get("/account", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "account.html"));
});


app.get("/api/event", (req, res) => {
  const filePath = path.join(__dirname, "event.json");

  // Leggi il file e manda il suo contenuto come JSON
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Errore durante la lettura di event.json:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData); // Manda il JSON al client
    } catch (parseError) {
      console.error("Errore nel parsing del JSON:", parseError);
      res.status(500).json({ error: "JSON non valido" });
    }
  });
});

app.listen(3000, () => console.log("Server avviato su http://localhost:3000"));