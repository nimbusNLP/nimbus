import * as fs from "fs";
import * as path from "path";
import { intro, confirm, outro, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { fileURLToPath } from "url";


export async function configureApp(): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(__filename);
  const configFilePath = path.join(currentDir, '..', '..', '..', "nimbus-config.json");

  if (fs.existsSync(configFilePath)) {
    try {
      const configData = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
      if (
        configData.localStorage &&
        typeof configData.localStorage === "string"
      ) {
        return configData.localStorage;
      }
    } catch (error) {
      console.error(
        chalk.red("❌  Error reading nimbusconfig.json. Will create a new one."),
      );
    }
  }

  intro("Nimbus Configuration");
  const shouldContinue = await confirm({
    message: chalk.blue("We need to create a directory in order to store your local configurations and artifacts. That directory will be placed in the current working directory if you do not want to store the configurations here please exit and navigate to the directory within which you would like them to reside. Would you like to continue?"),
  });

  if (isCancel(shouldContinue)) {
    console.log('\nConfiguration cancelled. Exiting Nimbus CLI...');
    process.exit(0);
  }

  if (shouldContinue) {
    try {
      const dirPath = path.join(process.cwd(), 'nimbusStorage')
      fs.mkdir(dirPath, () => {process.exit(0)})
      fs.writeFileSync(
        configFilePath,
        JSON.stringify({ localStorage: dirPath }, null, 2),
      );
      console.log(chalk.green("Configuration saved successfully!"));
      outro("Configuration complete!");
      return dirPath;
    } catch (error) {
      console.log('\nConfiguration cancelled. Exiting Nimbus CLI...');
      process.exit(0);
    }
  } else {
    console.log('\nConfiguration cancelled. Exiting Nimbus CLI...');
    process.exit(0);
  }


  // let storagePath = "";
  // let isValidPath = false;

  // while (!isValidPath) {
    // const pathInput = await text({
    //   message: "Enter the path where your models should be stored:",
    //   placeholder: "/path/to/model/storage",
    //   validate(value) {
    //     if (!value) return "Storage path is required";
    //     return undefined;
    //   },
    // });

    // if (isCancel(pathInput)) {
    //   console.log('\nConfiguration cancelled. Exiting Nimbus CLI...');
    //   process.exit(0);
    // }

  //   storagePath = String(pathInput);

  //   try {
  //     const stats = fs.statSync(storagePath);
  //     if (!stats.isDirectory()) {
  //       console.log(
  //         chalk.red("❌  The specified path is not a directory. Please try again."),
  //       );
  //       continue;
  //     }
  //     isValidPath = true;
  //   } catch (error) {
  //     console.log(
  //       chalk.red(
  //         "❌  Invalid path or directory does not exist. Please try again.",
  //       ),
  //     );
  //   }
  // }

  // try {
  //   fs.writeFileSync(
  //     configFilePath,
  //     JSON.stringify({ localStorage: storagePath }, null, 2),
  //   );
  //   console.log(chalk.green("Configuration saved successfully!"));
  // } catch (error) {
  //   console.error(
  //     chalk.red(
  //       "❌  Error saving configuration. Using path for this session only.",
  //     ),
  //   );
  // }

  // outro("Configuration complete!");
  // return storagePath;
}
