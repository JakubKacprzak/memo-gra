import express from "express";
import Player from "../models/Player.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  console.log("Otrzymano dane", req.body);
  const { name, moves, timer, level } = req.body;

  if (!name || !moves || !timer || !level) {
    return res.status(400).json({ message: "Wszystkie pola są wymagane" });
  }

  try {
    const player = new Player({
      name,
      moves,
      timer,
      level,
    });
    await player.save();
    res.status(201).json({ message: "Wynik zapisany pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas zapisywania wyniku w gameRoutes:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.get("/scores", async (req, res) => {
  try {
    const { level } = req.query;

    if (!level)
      return res.status(400).json({ message: "Brak poziomu trudności" });

    console.log("Pobieranie wyników dla poziomu:", level);

    const scores = await Player.find({ level })
      .sort({ timer: 1, moves: 1 })
      .limit(10);

    console.log("Znalezione wyniki:", scores);
    res.json(scores);
  } catch (error) {
    console.error("Błąd podczas pobierania wyników:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
