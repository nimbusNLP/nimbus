import figlet from "figlet";
import chalk from "chalk";
export function displayWelcomeMessage() {
  const asciiArt = figlet.textSync("NimbuS", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  const asciiArt2 = figlet.textSync("Let's deploy your models!", {
    font: "Small",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(chalk.greenBright(asciiArt));
  console.log(chalk.blue(asciiArt2));
}
export function displayCompletionMessage() {
  const asciiArt = figlet.textSync("Deployment Complete!", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(chalk.greenBright(asciiArt));
}
export function displayDeleteWelcomeMessage() {
  const asciiArt = figlet.textSync("Let's delete your models!", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(chalk.greenBright(asciiArt));
}
export function displayDeleteCompletionMessage() {
  const asciiArt = figlet.textSync("Deletion Complete!", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
}
