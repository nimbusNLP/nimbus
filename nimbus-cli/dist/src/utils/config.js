import * as fs from "fs";
import * as path from "path";
import { intro, text, outro, isCancel } from "@clack/prompts";
import chalk from "chalk";
/**
 * Configures the application by checking for or creating nimbusconfig.json
 * Returns the storage path for Nimbus models
 */
export async function configureApp() {
    const currentDir = process.cwd();
    const configFilePath = path.join(currentDir, "nimbus-config.json");
    // Check if config file exists
    if (fs.existsSync(configFilePath)) {
        try {
            const configData = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
            if (configData.localStorage &&
                typeof configData.localStorage === "string") {
                return configData.localStorage;
            }
        }
        catch (error) {
            console.error(chalk.red("❌  Error reading nimbusconfig.json. Will create a new one."));
        }
    }
    // Config file doesn't exist or is invalid - ask user for path
    intro("Nimbus Configuration");
    console.log(chalk.blue("We need to set up a local storage path for your models."));
    let storagePath = "";
    let isValidPath = false;
    while (!isValidPath) {
        const pathInput = await text({
            message: "Enter the path where your models should be stored:",
            placeholder: "/path/to/model/storage",
            validate(value) {
                if (!value)
                    return "Storage path is required";
                return undefined;
            },
        });
        // Handle cancellation
        if (isCancel(pathInput)) {
            outro(chalk.yellow("Setup cancelled. Exiting..."));
            process.exit(1);
        }
        storagePath = String(pathInput);
        // Validate directory
        try {
            const stats = fs.statSync(storagePath);
            if (!stats.isDirectory()) {
                console.log(chalk.red("❌  The specified path is not a directory. Please try again."));
                continue;
            }
            isValidPath = true;
        }
        catch (error) {
            console.log(chalk.red("❌  Invalid path or directory does not exist. Please try again."));
        }
    }
    // Create config file with validated path
    try {
        fs.writeFileSync(configFilePath, JSON.stringify({ localStorage: storagePath }, null, 2));
        console.log(chalk.green("Configuration saved successfully!"));
    }
    catch (error) {
        console.error(chalk.red("❌  Error saving configuration. Using path for this session only."));
    }
    outro("Configuration complete!");
    return storagePath;
}
