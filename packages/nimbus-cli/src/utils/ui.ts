import figlet from "figlet";
import chalk, { ChalkInstance } from "chalk";

export function displayWelcomeMessage(): void {
  displaySplitFiglet(
    chalk.greenBright,
    "NimbuS",
    undefined
  );
  
  displaySplitFiglet(
    chalk.blue,
    "Let's deploy",
    "your models!"
  );
}

export function displayCompletionMessage(): void {
  displaySplitFiglet(
    chalk.greenBright,
    "Deployment",
    "Complete!"
  );
}

export function displayDeleteWelcomeMessage(): void {
  displaySplitFiglet(
    chalk.greenBright,
    "Let's delete",
    "your models!"
  );
}

export function displayDeleteCompletionMessage(): void {
  displaySplitFiglet(
    chalk.greenBright,
    "Deletion",
    "Complete!"
  );
}

function displaySplitFiglet(
  colorMeth: ChalkInstance,
  firstPart: string,
  secondPart: string
): void {
  console.log(
    colorMeth(
      figlet.textSync(firstPart, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  secondPart && console.log(
    colorMeth(
      figlet.textSync(secondPart, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
}
