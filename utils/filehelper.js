import fs from "fs";
export const loadProverbs = () => {
  return JSON.parse(fs.readFileSync("proverbs.json", "utf-8"));
};

export const saveProverbs = () => {
  fs.writeFileSync("proverbs.json", JSON.stringify(loadProverbs, null, 2));
};
