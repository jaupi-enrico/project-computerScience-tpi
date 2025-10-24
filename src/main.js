import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as expressratelimit from "express-rate-limit";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rateLimit = expressratelimit.default;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 100 requests per windowMs
});

app.use(limiter);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

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

app.post("/api/favorite", (req, res) => {
  const filePath = path.join(__dirname, "event.json");
  const { id } = req.body; // prendi i dati dal body

  if (typeof id === "undefined") {
    return res.status(400).json({ error: "Dati mancanti (id)" });
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Errore durante la lettura di event.json:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }

    try {
      const events = JSON.parse(data);

      // Trova l'evento con l'id corrispondente
      const eventIndex = events.findIndex(e => e.id === id);

      if (eventIndex === -1) {
        return res.status(404).json({ error: "Evento non trovato" });
      }

      // Aggiorna il campo favorite (lo inverte o lo imposta al valore passato)
      events[eventIndex].favorite = !events[eventIndex].favorite;

      // Scrivi di nuovo nel file
      fs.writeFile(filePath, JSON.stringify(events, null, 2), err => {
        if (err) {
          console.error("Errore durante la scrittura di event.json:", err);
          return res.status(500).json({ error: "Errore nel salvataggio" });
        }

        res.json({ message: "Evento aggiornato correttamente", event: events[eventIndex] });
      });
    } catch (parseError) {
      console.error("Errore nel parsing del JSON:", parseError);
      res.status(500).json({ error: "JSON non valido" });
    }
  });
});

app.post("/api/buy", (req, res) => {
  const filePath = path.join(__dirname, "event.json");
  const { id } = req.body; // prendi i dati dal body

  if (typeof id === "undefined") {
    return res.status(400).json({ error: "Dati mancanti (id)" });
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Errore durante la lettura di event.json:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }

    try {
      const events = JSON.parse(data);

      // Trova l'evento con l'id corrispondente
      const eventIndex = events.findIndex(e => e.id == id);

      if (eventIndex === -1) {
        return res.status(404).json({ error: "Evento non trovato" });
      }

      // Aggiorna il campo favorite (lo inverte o lo imposta al valore passato)
      events[eventIndex].bought = true;

      // Scrivi di nuovo nel file
      fs.writeFile(filePath, JSON.stringify(events, null, 2), err => {
        if (err) {
          console.error("Errore durante la scrittura di event.json:", err);
          return res.status(500).json({ error: "Errore nel salvataggio" });
        }

        res.json({ message: "Evento aggiornato correttamente", event: events[eventIndex] });
      });
    } catch (parseError) {
      console.error("Errore nel parsing del JSON:", parseError);
      res.status(500).json({ error: "JSON non valido" });
    }
  });
});

// Route per la pagina dell'evento
app.get("/event", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detail.html"));
});

// Route per ottenere i dati JSON dell'evento
app.get("/api/event/:id", (req, res) => {
  const filePath = path.join(__dirname, "event.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Errore durante la lettura di event.json:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }

    try {
      const jsonData = JSON.parse(data);
      const eventId = req.params.id;

      // Trova l'evento con l'ID corrispondente (se i tuoi eventi hanno un campo id)
      const event = jsonData.find(e => e.id == eventId);

      if (!event) {
        return res.status(404).json({ error: "Evento non trovato" });
      }

      res.json(event);
    } catch (parseError) {
      console.error("Errore nel parsing del JSON:", parseError);
      res.status(500).json({ error: "JSON non valido" });
    }
  });
});

app.get("/map", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "map.html"));
});

app.listen(3000, () => console.log("Server avviato su http://localhost:3000"));