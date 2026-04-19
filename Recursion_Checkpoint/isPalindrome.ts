import * as readline from "readline";

// ANSI escape codes for terminal colors and styles
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  bgCyan: "\x1b[46m",
  white: "\x1b[37m",
};

// Base case: a word of 0 or 1 character is always a palindrome
// Recursive case: check that both ends match, then test the inner substring
function isPalindrome(word: string): boolean {
  if (word.length <= 1) return true;
  if (word[0] !== word[word.length - 1]) return false;
  return isPalindrome(word.slice(1, -1));
}

// Color the two mirrored halves in different colors to visualize the symmetry
// The center character (for odd-length words) is highlighted in yellow
function highlight(word: string): string {
  const mid = Math.floor(word.length / 2);
  const left = word.slice(0, mid);
  const middle = word.length % 2 !== 0 ? word[mid] : "";
  const right = word.slice(word.length % 2 !== 0 ? mid + 1 : mid);
  return (
    `${c.cyan}${left}${c.reset}` +
    `${c.yellow}${middle}${c.reset}` +
    `${c.magenta}${right}${c.reset}`
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printHeader(): void {
  console.clear();
  console.log(`${c.cyan}${c.bold}`);
  console.log("  ╔═══════════════════════════════╗");
  console.log("  ║     🔁  Palindrome Checker     ║");
  console.log("  ╚═══════════════════════════════╝");
  console.log(`${c.reset}`);
  console.log(`  ${c.dim}Type a word and press Enter.`);
  console.log(`  Type ${c.yellow}exit${c.reset}${c.dim} to quit.${c.reset}\n`);
}

// Main loop: ask for input, check the word, then recurse back to prompt
function prompt(): void {
  rl.question(`  ${c.cyan}>${c.reset} `, (input) => {
    const word = input.trim().toLowerCase();

    if (!word) {
      prompt();
      return;
    }

    if (word === "exit") {
      console.log(`\n  ${c.dim}Goodbye! 👋${c.reset}\n`);
      rl.close();
      return;
    }

    const result = isPalindrome(word);

    if (result) {
      console.log(
        `\n  ${c.green}${c.bold}✔ "${highlight(word)}" ${c.green}is a palindrome!${c.reset}\n`
      );
    } else {
      console.log(
        `\n  ${c.red}${c.bold}✘ "${c.white}${word}${c.reset}${c.red}" is NOT a palindrome.${c.reset}\n`
      );
    }

    prompt();
  });
}

printHeader();
prompt();
