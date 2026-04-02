const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// ─────────────────────────────────────────────
// ANSI STYLES
// ─────────────────────────────────────────────

const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  white:  "\x1b[97m",
  gray:   "\x1b[90m",
  bgCyan: "\x1b[46m\x1b[30m",
  bgGreen:"\x1b[42m\x1b[30m",
};

const W = 52;

function line(char = "─") {
  return char.repeat(W);
}

function box(title, color = c.cyan) {
  console.log(`\n${color}╔${line("═")}╗${c.reset}`);
  const pad = Math.floor((W - title.length) / 2);
  const extra = (W - title.length) % 2;
  console.log(`${color}║${c.reset}${" ".repeat(pad)}${c.bold}${color}${title}${c.reset}${" ".repeat(pad + extra)}${color}║${c.reset}`);
  console.log(`${color}╚${line("═")}╝${c.reset}`);
}

function section(label) {
  console.log(`\n${c.gray}┌${line("─")}┐${c.reset}`);
  console.log(`${c.gray}│${c.reset} ${c.bold}${c.yellow}${label}${c.reset}${" ".repeat(W - label.length - 1)}${c.gray}│${c.reset}`);
  console.log(`${c.gray}└${line("─")}┘${c.reset}`);
}

function result(label, value, success = true) {
  const tag = success ? `${c.green}[OK]${c.reset}` : `${c.red}[NO]${c.reset}`;
  console.log(`\n  ${tag}  ${c.bold}${label}:${c.reset} ${c.white}${value}${c.reset}`);
}

function info(msg) {
  console.log(`  ${c.gray}::${c.reset} ${c.dim}${msg}${c.reset}`);
}

function error(msg) {
  console.log(`\n  ${c.red}[ERR]${c.reset} ${msg}`);
}

function prompt(q) {
  return ask(`  ${c.cyan}>${c.reset}  ${c.bold}${q}${c.reset}  `);
}

// ─────────────────────────────────────────────
// DECISION MAKING
// ─────────────────────────────────────────────

function isLeapYear(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0)   return true;
  return false;
}

function weatherAdvice(temp, isRaining) {
  let clothing;

  if (temp <= 0) {
    clothing = "heavy winter coat, thermal layers, gloves & hat";
  } else if (temp <= 10) {
    clothing = "warm jacket and a scarf";
  } else if (temp <= 20) {
    clothing = "a light jacket or sweater";
  } else {
    clothing = "light clothes — t-shirt and shorts";
  }

  if (isRaining) clothing += " + umbrella";
  return clothing;
}

// ─────────────────────────────────────────────
// RECURSION
// ─────────────────────────────────────────────

function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.length <= 1) return true;
  if (clean[0] !== clean[clean.length - 1]) return false;
  return isPalindrome(clean.slice(1, -1));
}

function power(base, exp) {
  if (exp === 0)  return 1;
  if (exp < 0)    return 1 / power(base, -exp);
  return base * power(base, exp - 1);
}

// ─────────────────────────────────────────────
// RUNNERS
// ─────────────────────────────────────────────

async function runLeapYear() {
  section("Leap Year Checker");
  info("Checks if a year is divisible by 4, 100, or 400");
  const input = await prompt("Enter a year:");
  const year = parseInt(input);
  if (isNaN(year)) return error("That's not a valid year.");
  const leap = isLeapYear(year);
  result(
    year.toString(),
    leap ? "Leap year" : "Not a leap year",
    leap
  );
}

async function runWeather() {
  section("Weather Clothing Adviser");
  info("Recommends clothing based on temperature and rain");
  const tempInput = await prompt("Temperature (°C):");
  const rainInput = await prompt("Is it raining? (yes / no):");
  const temp = parseFloat(tempInput);
  if (isNaN(temp)) return error("Invalid temperature.");
  const raining = rainInput.trim().toLowerCase() === "yes";
  result("Outfit", weatherAdvice(temp, raining));
  result("Condition", `${temp}°C ${raining ? "Raining" : "Dry"}`);
}

async function runPalindrome() {
  section("Palindrome Checker");
  info("Ignores spaces, punctuation and casing");
  const str = await prompt("Enter a string:");
  const ok = isPalindrome(str);
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  result(`"${str}"`, ok ? "Palindrome ✓" : "Not a palindrome", ok);
  info(`Cleaned: "${clean}"`);
}

async function runPower() {
  section("Power Function");
  info("Recursive exponentiation — no Math.pow()");
  const baseInput = await prompt("Base:");
  const expInput  = await prompt("Exponent:");
  const base = parseFloat(baseInput);
  const exp  = parseInt(expInput);
  if (isNaN(base) || isNaN(exp)) return error("Invalid numbers.");
  result(`${base} ^ ${exp}`, power(base, exp).toString());
}

// ─────────────────────────────────────────────
// MAIN MENU
// ─────────────────────────────────────────────

const menu = [
  { key: "1", label: "Leap Year Checker",       fn: runLeapYear   },
  { key: "2", label: "Weather Clothing Adviser", fn: runWeather    },
  { key: "3", label: "Palindrome Checker",       fn: runPalindrome },
  { key: "4", label: "Power Function",           fn: runPower      },
  { key: "5", label: "Exit",                     fn: null          },
];

function showMenu() {
  box("Decision Making & Recursion", c.cyan);
  console.log();

  for (const item of menu) {
    if (item.key === "5") {
      console.log(`  ${c.gray}${item.key}.${c.reset}  ${c.dim}${item.label}${c.reset}`);
    } else {
      console.log(`  ${c.bold}${c.cyan}${item.key}.${c.reset}  ${c.white}${item.label}${c.reset}`);
    }
  }
  console.log();
}

async function main() {
  while (true) {
    showMenu();

    const choice = (await ask(`  ${c.cyan}>${c.reset}  `)).trim();
    const selected = menu.find((m) => m.key === choice);

    if (!selected) {
      console.log(`\n  ${c.yellow}[!]${c.reset}  Invalid option -- choose 1 to 5.`);
      continue;
    }

    if (selected.key === "5") {
      console.log(`\n  ${c.dim}Goodbye!${c.reset}\n`);
      rl.close();
      break;
    }

    await selected.fn();
    await ask(`\n  ${c.gray}Press Enter to continue...${c.reset}`);
  }
}

main();