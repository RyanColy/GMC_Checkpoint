"use strict";
const readline = require("readline");

// ── ANSI color helpers ────────────────────────────────────────────────────────
const C = {
  bold:    s => `\x1b[1m${s}\x1b[0m`,
  dim:     s => `\x1b[2m${s}\x1b[0m`,
  cyan:    s => `\x1b[36m${s}\x1b[0m`,
  magenta: s => `\x1b[35m${s}\x1b[0m`,
  green:   s => `\x1b[32m${s}\x1b[0m`,
  yellow:  s => `\x1b[33m${s}\x1b[0m`,
  red:     s => `\x1b[31m${s}\x1b[0m`,
  white:   s => `\x1b[97m${s}\x1b[0m`,
};

// ── 1. Array Queue — circular buffer, fixed capacity ─────────────────────────
// head/tail are indices that wrap around via % capacity → avoids O(n) shifts.
// All operations: O(1).
class ArrayQueue {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.data = new Array(capacity);
    this.head = 0; // index of front element
    this.tail = 0; // index where next element will be inserted
    this.size = 0;
  }

  enqueue(el) {
    if (this.size === this.capacity) throw new Error(`Queue full (capacity ${this.capacity}).`);
    this.data[this.tail] = el;
    this.tail = (this.tail + 1) % this.capacity; // wrap around
    this.size++;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("Queue is empty.");
    const val = this.data[this.head];
    this.data[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity; // wrap around
    this.size--;
    return val;
  }

  peek()    { if (this.isEmpty()) throw new Error("Queue is empty."); return this.data[this.head]; }
  isEmpty() { return this.size === 0; }

  // Reconstruct logical order (head → tail) accounting for wrap-around
  toArray() {
    return Array.from({ length: this.size }, (_, i) => this.data[(this.head + i) % this.capacity]);
  }
}

// ── 2. Linked List Queue — dynamic size ──────────────────────────────────────
// tail pointer makes enqueue O(1) without traversing the list.
// All operations: O(1).
class LLNode { constructor(v) { this.value = v; this.next = null; } }

class LinkedListQueue {
  constructor() { this.head = null; this.tail = null; this.size = 0; }

  enqueue(el) {
    const node = new LLNode(el);
    if (this.tail) this.tail.next = node; // link old tail → new node
    else           this.head = node;      // first insert: head = tail = node
    this.tail = node;
    this.size++;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("Queue is empty.");
    const val = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null; // list is now empty, clear dangling tail
    this.size--;
    return val;
  }

  peek()    { if (this.isEmpty()) throw new Error("Queue is empty."); return this.head.value; }
  isEmpty() { return this.size === 0; }

  toArray() {
    const out = []; let cur = this.head;
    while (cur) { out.push(cur.value); cur = cur.next; }
    return out;
  }
}

// ── 3. Min-Heap Priority Queue ───────────────────────────────────────────────
// Binary heap stored in an array. Parent at i → children at 2i+1, 2i+2.
// Heap property: parent.priority ≤ children.priority → min always at index 0.
// insert: O(log n) via bubbleUp | extractMin: O(log n) via sinkDown | peek: O(1)
class MinHeapPQ {
  constructor() { this.heap = []; }

  insert(value, priority) {
    this.heap.push({ value, priority });
    this._bubbleUp(this.heap.length - 1); // restore heap property upward
  }

  extractMin() {
    if (this.isEmpty()) throw new Error("Priority queue is empty.");
    const min  = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length) { this.heap[0] = last; this._sinkDown(0); } // restore downward
    return min;
  }

  peekMin()  { if (this.isEmpty()) throw new Error("Priority queue is empty."); return this.heap[0]; }
  isEmpty()  { return this.heap.length === 0; }
  toArray()  { return [...this.heap].sort((a, b) => a.priority - b.priority); }

  _bubbleUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1; // parent index
      if (this.heap[p].priority <= this.heap[i].priority) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let min = i, l = 2*i+1, r = 2*i+2;
      if (l < n && this.heap[l].priority < this.heap[min].priority) min = l;
      if (r < n && this.heap[r].priority < this.heap[min].priority) min = r;
      if (min === i) break;
      [this.heap[min], this.heap[i]] = [this.heap[i], this.heap[min]];
      i = min;
    }
  }
}

// ── 4. Ordered Array Priority Queue ──────────────────────────────────────────
// Array kept sorted on every insert → min always at index 0.
// insert: O(n) (binary search O(log n) + splice shift O(n)) | extractMin/peek: O(1)
class OrderedArrayPQ {
  constructor() { this.data = []; }

  insert(value, priority) {
    // Binary search for insertion point to keep array sorted by priority
    let lo = 0, hi = this.data.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      this.data[mid].priority <= priority ? lo = mid + 1 : hi = mid;
    }
    this.data.splice(lo, 0, { value, priority });
  }

  extractMin() { if (this.isEmpty()) throw new Error("Priority queue is empty."); return this.data.shift(); }
  peekMin()    { if (this.isEmpty()) throw new Error("Priority queue is empty."); return this.data[0]; }
  isEmpty()    { return this.data.length === 0; }
  toArray()    { return [...this.data]; }
}

// ── Display helpers ───────────────────────────────────────────────────────────
const sep = () => C.dim("─".repeat(62));

function banner() {
  console.clear();
  console.log(C.bold(C.cyan("\n╔══════════════════════════════════════════════════════════════╗")));
  console.log(C.bold(C.cyan("║          Data Structures Explorer  —  Interactive CLI        ║")));
  console.log(C.bold(C.cyan("╚══════════════════════════════════════════════════════════════╝\n")));
}

function renderQueue(arr) {
  if (!arr.length) return C.dim("  [ empty ]");
  return "  " + arr.map((el, i) => {
    const box = `[${el}]`;
    if (arr.length === 1)     return C.green(box)  + C.dim(" ← HEAD & TAIL");
    if (i === 0)              return C.green(box)  + C.dim(" ← HEAD");
    if (i === arr.length - 1) return C.yellow(box) + C.dim(" ← TAIL");
    return C.white(box);
  }).join(C.dim(" → "));
}

function renderPQ(arr) {
  if (!arr.length) return C.dim("  [ empty ]");
  return "  " + arr.map((item, i) =>
    (i === 0 ? C.green(`[${item.value} | p:${item.priority}]`) + C.dim(" ← MIN")
             : C.white(`[${item.value} | p:${item.priority}]`))
  ).join(C.dim(" → "));
}

// ── App state ─────────────────────────────────────────────────────────────────
const state = {
  screen: "main",  // "main" | "queue_pick" | "pq_pick" | "queue" | "pq"
  mode:   null,    // "array" | "linkedlist" | "minheap" | "orderedarray"
  ds: {
    array:        new ArrayQueue(8),
    linkedlist:   new LinkedListQueue(),
    minheap:      new MinHeapPQ(),
    orderedarray: new OrderedArrayPQ(),
  },
};

const cur = () => state.ds[state.mode];

// ── Screen renderers ──────────────────────────────────────────────────────────
// Each screen function updates state.screen, clears terminal, prints its UI.

function showMain() {
  state.screen = "main"; state.mode = null;
  banner();
  console.log(C.bold("  What do you want to explore?\n"));
  console.log(`  ${C.cyan("1")}  Queue          ${C.dim("→ Array-based | Linked List")}`);
  console.log(`  ${C.magenta("2")}  Priority Queue ${C.dim("→ Min-Heap    | Ordered Array")}`);
  console.log(`  ${C.red("exit")}  Quit\n`);
  console.log(sep());
}

function showQueuePicker() {
  state.screen = "queue_pick";
  banner();
  console.log(C.bold("  Choose a Queue implementation:\n"));
  console.log(`  ${C.cyan("1")}  Array-based      ${C.dim("(fixed size = 8, circular buffer)")}`);
  console.log(`  ${C.magenta("2")}  Linked List-based ${C.dim("(dynamic, no size limit)")}`);
  console.log(`  ${C.yellow("back")}  ← Main menu\n`);
  console.log(sep());
}

function showPQPicker() {
  state.screen = "pq_pick";
  banner();
  console.log(C.bold("  Choose a Priority Queue implementation:\n"));
  console.log(`  ${C.cyan("1")}  Min-Heap      ${C.dim("(insert O(log n), extractMin O(log n))")}`);
  console.log(`  ${C.magenta("2")}  Ordered Array ${C.dim("(insert O(n),     extractMin O(1))")}`);
  console.log(`  ${C.yellow("back")}  ← Main menu\n`);
  console.log(sep());
}

// Shared helper: prints the current state of the active structure
function printState() {
  const ds  = cur();
  const arr = ds.toArray();
  const isQueue = ["array", "linkedlist"].includes(state.mode);

  if (isQueue) {
    const info = state.mode === "array"
      ? `Size: ${ds.size}/${ds.capacity}  ${ds.size === ds.capacity ? C.red("(FULL)") : ""}`
      : `Size: ${ds.size}`;
    console.log(`\n  ${C.bold("State:")} ${info}`);
    console.log(renderQueue(arr));
  } else {
    console.log(`\n  ${C.bold("State:")} Size: ${arr.length}`);
    console.log(renderPQ(arr));
  }
  console.log();
}

// Shared helper: prints the command menu for the active mode
function showCommands() {
  const isQueue = ["array", "linkedlist"].includes(state.mode);
  state.screen  = isQueue ? "queue" : "pq";
  const isFirst = ["array", "minheap"].includes(state.mode);
  const color   = isFirst ? C.cyan : C.magenta;
  const labels  = {
    array:        `Array-based Queue  ${C.dim(`(${cur().size}/${cur().capacity})`)}`,
    linkedlist:   `Linked List Queue  ${C.dim(`(${cur().size} — no limit)`)}`,
    minheap:      "Min-Heap Priority Queue",
    orderedarray: "Ordered Array Priority Queue",
  };

  banner();
  console.log(`  ${C.bold("Mode:")} ${color(labels[state.mode])}\n`);

  if (isQueue) {
    console.log(`  ${color("enqueue <value>")}  — Add element`);
    console.log(`  ${color("dequeue")}          — Remove & return front`);
    console.log(`  ${color("peek")}             — View front (no remove)`);
  } else {
    console.log(`  ${color("insert <value> <priority>")}  — Add item`);
    console.log(`  ${color("extractMin")}                 — Remove & return min`);
    console.log(`  ${color("peekMin")}                    — View min (no remove)`);
  }

  console.log(`  ${color("isEmpty")}${isQueue ? "          " : "                    "}— Check if empty`);
  console.log(`  ${color("display")}${isQueue ? "          " : "                    "}— Show state`);
  console.log(`  ${C.yellow("switch")}${isQueue ? "           " : "                      "}— Change implementation`);
  console.log(`  ${C.yellow("back")}${isQueue ? "             " : "                        "}— Main menu`);
  console.log(`  ${C.red("exit")}${isQueue ? "             " : "                        "}— Quit\n`);
  console.log(sep());
  printState();
}

// ── Command handlers ──────────────────────────────────────────────────────────

function handleQueueCmd(cmd, args) {
  const ds = cur();
  switch (cmd) {
    case "enqueue":
      if (!args.length) { console.log(C.yellow("\n  Usage: enqueue <value>\n")); return; }
      ds.enqueue(args.join(" "));
      console.log(C.green(`\n  ✔ Enqueued: "${args.join(" ")}"\n`));
      break;
    case "dequeue": { const v = ds.dequeue(); console.log(C.green(`\n  ✔ Dequeued: "${v}"\n`)); break; }
    case "peek":    { const v = ds.peek();    console.log(C.green(`\n  ✔ Front: "${v}"\n`));    break; }
    case "isempty": console.log(C.green(`\n  ✔ isEmpty → ${ds.isEmpty()}\n`)); break;
    case "display": break; // just fall through to printState()
    case "switch":  showQueuePicker(); return;
    case "back":    showMain();        return;
    default: console.log(C.red(`\n  Unknown command: "${cmd}"\n`)); showCommands(); return;
  }
  printState();
}

function handlePQCmd(cmd, args) {
  const ds = cur();
  switch (cmd) {
    case "insert": {
      if (args.length < 2) { console.log(C.yellow("\n  Usage: insert <value> <priority>\n")); return; }
      const priority = Number(args.at(-1));
      if (isNaN(priority)) { console.log(C.red("\n  Priority must be a number.\n")); return; }
      const value = args.slice(0, -1).join(" ");
      ds.insert(value, priority);
      console.log(C.green(`\n  ✔ Inserted: "${value}" (priority ${priority})\n`));
      break;
    }
    case "extractmin": { const it = ds.extractMin(); console.log(C.green(`\n  ✔ ExtractMin → "${it.value}" (p:${it.priority})\n`)); break; }
    case "peekmin":    { const it = ds.peekMin();    console.log(C.green(`\n  ✔ PeekMin → "${it.value}" (p:${it.priority})\n`));    break; }
    case "isempty": console.log(C.green(`\n  ✔ isEmpty → ${ds.isEmpty()}\n`)); break;
    case "display": break;
    case "switch":  showPQPicker(); return;
    case "back":    showMain();     return;
    default: console.log(C.red(`\n  Unknown command: "${cmd}"\n`)); showCommands(); return;
  }
  printState();
}

// ── Router ────────────────────────────────────────────────────────────────────
// Parses each input line, dispatches to the right screen/handler.
// All errors thrown by data structures are caught here and shown in red.
function route(line) {
  const [raw, ...args] = line.trim().split(/\s+/);
  const cmd = (raw || "").toLowerCase();
  if (!cmd) return;
  if (cmd === "exit" || cmd === "quit") { console.log(C.green("\n  Bye!\n")); process.exit(0); }

  try {
    switch (state.screen) {
      case "main":
        if      (cmd === "1") showQueuePicker();
        else if (cmd === "2") showPQPicker();
        else console.log(C.red("\n  Type 1, 2, or exit.\n"));
        break;

      case "queue_pick":
        if      (cmd === "1") { state.mode = "array";      showCommands(); }
        else if (cmd === "2") { state.mode = "linkedlist";  showCommands(); }
        else if (cmd === "back") showMain();
        else console.log(C.red("\n  Type 1, 2, or back.\n"));
        break;

      case "pq_pick":
        if      (cmd === "1") { state.mode = "minheap";      showCommands(); }
        else if (cmd === "2") { state.mode = "orderedarray";  showCommands(); }
        else if (cmd === "back") showMain();
        else console.log(C.red("\n  Type 1, 2, or back.\n"));
        break;

      case "queue": handleQueueCmd(cmd, args); break;
      case "pq":    handlePQCmd(cmd, args);    break;
    }
  } catch (e) {
    console.log(C.red(`\n  ✖  ${e.message}\n`));
  }
}

// ── Main loop ─────────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

showMain();

function prompt() {
  const p = state.mode
    ? (["array", "minheap"].includes(state.mode) ? C.bold(C.cyan("  › ")) : C.bold(C.magenta("  › ")))
    : C.bold("  › ");
  rl.setPrompt(p);
  rl.prompt();
}

prompt();
rl.on("line", line => { route(line); prompt(); });