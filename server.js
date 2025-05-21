import express from "express";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import routes from "./routes/routes.js";
// Express setup
const app = express();
const PORT = 3000;
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
// file and folder setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datapath = path.join(__dirname, "proverbs.json");
if (!fs.existsSync(datapath)) fs.writeFileSync(datapath, "[]");

// routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is  running at http://localhost:${PORT}`);
});
