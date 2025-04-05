import figlet from "figlet";
import chalk from "chalk";
export function displayWelcomeMessage() {
    // Get terminal width
    const terminalWidth = process.stdout.columns || 80;
    // For the title, use figlet with appropriate font size
    const titleFont = terminalWidth < 80 ? "Small" : "Standard";
    const asciiArt = figlet.textSync("NimbuS", {
        font: titleFont,
        horizontalLayout: "default",
        verticalLayout: "default",
    });
    console.log(chalk.greenBright(asciiArt));
    // For the subtitle, use plain text for small terminals
    if (terminalWidth < 80) {
        console.log(chalk.blue("Let's deploy your models!"));
    }
    else {
        // For larger terminals, split the message to ensure words stay together
        console.log(chalk.blue(figlet.textSync("Let's deploy", {
            font: "Small",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
        console.log(chalk.blue(figlet.textSync("your models!", {
            font: "Small",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
    }
}
export function displayCompletionMessage() {
    const terminalWidth = process.stdout.columns || 80;
    if (terminalWidth < 80) {
        console.log(chalk.greenBright("Deployment Complete!"));
    }
    else {
        console.log(chalk.greenBright(figlet.textSync("Deployment", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
        console.log(chalk.greenBright(figlet.textSync("Complete!", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
    }
}
export function displayDeleteWelcomeMessage() {
    const terminalWidth = process.stdout.columns || 80;
    if (terminalWidth < 80) {
        console.log(chalk.greenBright("Let's delete your models!"));
    }
    else {
        console.log(chalk.greenBright(figlet.textSync("Let's delete", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
        console.log(chalk.greenBright(figlet.textSync("your models!", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
    }
}
export function displayDeleteCompletionMessage() {
    const terminalWidth = process.stdout.columns || 80;
    if (terminalWidth < 80) {
        console.log(chalk.greenBright("Deletion Complete!"));
    }
    else {
        console.log(chalk.greenBright(figlet.textSync("Deletion", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
        console.log(chalk.greenBright(figlet.textSync("Complete!", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
        })));
    }
}
