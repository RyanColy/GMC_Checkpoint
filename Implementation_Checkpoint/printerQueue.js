const readline = require("readline");

// ─── Queue ───────────────────────────────────────────────
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.isEmpty() ? null : this.items.shift(); }
  peek() { return this.isEmpty() ? null : this.items[0]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}

// ─── PrinterQueue ─────────────────────────────────────────
class PrinterQueue {
  constructor() {
    this.queue = new Queue();
  }

  addJob(name, pages) {
    this.queue.enqueue({ name, pages });
    console.log(`\nJob added: ${name} (${pages} pages)`);
  }

  processJob() {
    if (this.queue.isEmpty()) {
      console.log("\nNo jobs to process.");
      return;
    }
    const job = this.queue.dequeue();
    console.log(`\nProcessing: ${job.name} (${job.pages} pages)`);
  }

  printQueue() {
    if (this.queue.isEmpty()) {
      console.log("\nThe queue is empty.");
      return;
    }
    console.log("\nCurrent queue:");
    this.queue.items.forEach((job, i) => {
      console.log(`  ${i + 1}. ${job.name} - ${job.pages} pages`);
    });
  }
}

// ─── CLI ──────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const printer = new PrinterQueue();

function showMenu() {
  console.log(`
---------------------------
  PRINTER QUEUE MENU
---------------------------
  1. Add a job
  2. Process next job
  3. View the queue
  4. Quit
---------------------------`);
}

async function main() {
  let running = true;

  while (running) {
    showMenu();
    const choice = await ask("Choice: ");

    switch (choice.trim()) {
      case "1":
        const name = await ask("Job name: ");
        const pages = await ask("Number of pages: ");
        const p = parseInt(pages);
        if (!name.trim()) {
          console.log("\nError: name cannot be empty.");
        } else if (isNaN(p) || p <= 0) {
          console.log("\nError: invalid number of pages.");
        } else {
          printer.addJob(name.trim(), p);
        }
        break;

      case "2":
        printer.processJob();
        break;

      case "3":
        printer.printQueue();
        break;

      case "4":
        console.log("\nGoodbye.\n");
        running = false;
        break;

      default:
        console.log("\nInvalid choice, try 1-4.");
    }
  }

  rl.close();
}

main();