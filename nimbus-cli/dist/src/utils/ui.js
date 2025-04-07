import figlet from "figlet";
import chalk from "chalk";
export function displayWelcomeMessage() {
    displaySplitFiglet(chalk.greenBright, "NimbuS", undefined);
    displaySplitFiglet(chalk.blue, "Let's deploy", "your models!");
}
export function displayCompletionMessage() {
    displaySplitFiglet(chalk.greenBright, "Deployment", "Complete!");
}
export function displayDeleteWelcomeMessage() {
    displaySplitFiglet(chalk.greenBright, "Let's delete", "your models!");
}
export function displayDeleteCompletionMessage() {
    displaySplitFiglet(chalk.greenBright, "Deletion", "Complete!");
}
function displaySplitFiglet(colorMeth, firstPart, secondPart) {
    console.log(colorMeth(figlet.textSync(firstPart, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
    })));
    secondPart && console.log(colorMeth(figlet.textSync(secondPart, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
    })));
}
