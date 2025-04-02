// src/utilities/storageUtils.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "api-config.json");

export function storeApiData(apiId, apiName, roleArn) {
  const data = { apiId, apiName, roleArn };
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf-8");
}

// key: apiId | apiName | roleArn
export function getStoredApiData(key) {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(data);
    return json[key];
  } catch (error) {
    console.error("Failed to load stored API ID. Have you run 'initApi'?", error);
    process.exit(1);
  }
}
