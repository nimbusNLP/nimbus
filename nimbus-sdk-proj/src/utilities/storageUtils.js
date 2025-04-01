// src/utilities/storageUtils.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "api-config.json");

export function storeApiId(apiId) {
  const data = { apiId };
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf-8");
}

export function getStoredApiId() {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(data);
    return json.apiId;
  } catch (error) {
    console.error("Failed to load stored API ID. Have you run 'initApi'?", error);
    process.exit(1);
  }
}
