import express, { Router } from "express";
import { loadProverbs, saveProverbs } from "../utils/filehelper.js";

const router = express.Router();
// GET all proverbs
router.get("/", (req, res) => {
  let proverbs = loadProverbs();
  const { search } = req.query;
  if (search) {
    const keyWords = search.toLowerCase();
    proverbs = proverbs.filter((p) =>
      Object.values(p).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(keyWords)
      )
    );
  }
  res.json(proverbs);
});
// By random
router.get("/random", (req, res) => {
  const proverbs = loadProverbs();
  const random = proverbs[Math.floor(Math.random() * proverbs.length)];
  res.json(random);
});
// Get Proverbs one by one
router.get("/:id", (req, res) => {
  const proverbs = loadProverbs();
  const proverb = proverbs.find((p) => p.id === req.params.id);
  proverb ? res.json(proverb) : res.status(404).send("Not found");
});
// POST a new proverb
router.post("/", (req, res) => {
  const proverbs = loadProverbs();
  const newProverb = {
    id: Date.now().toString(),
    textDari: req.body.textDari,
    textPashto: req.body.textPashto,
    translationEn: req.body.translationEn,
    meaning: req.body.meaning,
    category: req.body.category,
  };
  proverbs.push(newProverb);
  saveProverbs(proverbs);
  res.status(201).json(newProverb);
});
// PUT update a proverb
router.put("/:id", (req, res) => {
  const proverbs = loadProverbs();
  const index = proverbs.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).send("Not found");

  proverbs[index] = { ...proverbs[index], ...req.body };
  saveProverbs(proverbs);
  res.json(proverbs[index]);
});

// DELETE a proverb
router.delete("/:id", (req, res) => {
  let proverbs = loadProverbs();
  proverbs = proverbs.filter((p) => p.id !== req.params.id);
  saveProverbs(proverbs);
  res.status(204).send();
});

export default router;
