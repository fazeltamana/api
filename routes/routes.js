import express from "express";
import { loadProverbs, saveProverbs } from "../utils/filehelper.js";

const router = express.Router();

// GET: All Proverbs (with optional search)
router.get("/", (req, res) => {
  let proverbs = loadProverbs();
  res.render("index", { proverbs });
});
// Search Bar
router.get("/search", (req, res) => {
  let proverbs = loadProverbs();
  let matches =[];
  const { search } = req.query;
  if (search) {
    const keyword = search.toLowerCase().trim();
    matches= proverbs.filter((p) =>
      Object.values(p).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(keyword)
      )
    );
  }
  res.render("search", { search: search || "", matches });
});
// GET: Add Form
router.get("/add", (req, res) => {
  res.render("addForm");
});

// POST: Create a New Proverb
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
  res.status(201).render("add", { newProverb });
});

// GET: Random Proverb
router.get("/random", (req, res) => {
  const proverbs = loadProverbs();
  const random = proverbs[Math.floor(Math.random() * proverbs.length)];
  res.render("random", { random });
});

// GET: Edit Form
router.get("/:id/edit", (req, res) => {
  const proverbs = loadProverbs();
  const proverb = proverbs.find((p) => p.id === req.params.id);

  if (!proverb) return res.status(404).send("Proverb not found");
  res.render("edit", { proverb });
});

// POST: Update Proverb
router.post("/:id/edit", (req, res) => {
  const proverbs = loadProverbs();
  const proverb = proverbs.find((p) => p.id === req.params.id);

  if (!proverb) return res.status(404).send("Proverb not found");

  proverb.textDari = req.body.textDari;
  proverb.textPashto = req.body.textPashto;
  proverb.translationEn = req.body.translationEn;
  proverb.meaning = req.body.meaning;
  proverb.category = req.body.category;

  saveProverbs(proverbs);
  res.redirect("/");
});

// GET: View Detailed Single Proverb
router.get("/:id/single", (req, res) => {
  const proverbs = loadProverbs();
  const proverb = proverbs.find((p) => p.id === req.params.id);

  if (!proverb) return res.status(404).send("Proverb not found");
  res.render("single", { proverb });
});

// DELETE: Delete Proverb
router.delete("/:id", (req, res) => {
  let proverbs = loadProverbs();
  proverbs = proverbs.filter((p) => p.id !== req.params.id);
  saveProverbs(proverbs);
  res.redirect("/");
});

export default router;
