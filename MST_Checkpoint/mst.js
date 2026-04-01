const readline = require('readline');

// ANSI color helpers
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m',
  red: '\x1b[31m', magenta: '\x1b[35m',
};
const c    = (color, txt) => `${C[color]}${txt}${C.reset}`;
const bold = txt => c('bold', txt);
const dim  = txt => c('dim', txt);

// ── Graph ─────────────────────────────────────────────────────────────────────

class Graph {
  constructor() {
    this.nodes     = new Set();  // node labels
    this.edges     = [];         // { from, to, weight }
    this.adjacency = new Map();  // label -> [{ to, weight }]
  }

  addNode(label) {
    if (this.nodes.has(label)) return false;
    this.nodes.add(label);
    this.adjacency.set(label, []);
    return true;
  }

  addEdge(from, to, weight) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) return false;
    if (from === to) return false;
    const dup = this.edges.some(
      e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    if (dup) return false;
    this.edges.push({ from, to, weight });
    this.adjacency.get(from).push({ to, weight });
    this.adjacency.get(to).push({ to: from, weight });
    return true;
  }

  printAdjacency() {
    console.log('\n' + c('cyan', bold('  ┌─ ADJACENCY LIST ─────────────────────────')));
    for (const [node, neighbors] of this.adjacency) {
      const line = neighbors.length
        ? neighbors.map(n => `${c('green', n.to)}${dim(`(${n.weight}m)`)}`).join(' → ')
        : dim('(isolated)');
      console.log(`  │  ${c('yellow', node.padEnd(6))} ┤ ${line}`);
    }
    console.log(c('cyan', '  └───────────────────────────────────────────\n'));
  }

  printEdges(mstSet = new Set()) {
    console.log(c('cyan', bold('  ┌─ EDGE LIST ─────────────────────────────────')));
    if (!this.edges.length) console.log(`  │  ${dim('(no edges yet)')}`);
    this.edges.forEach((e, i) => {
      const inMST = mstSet.has(`${e.from}-${e.to}`) || mstSet.has(`${e.to}-${e.from}`);
      const mark  = inMST ? c('green', ' ✓ MST') : dim('      ');
      console.log(`  │  [${String(i + 1).padStart(2)}] ${c('yellow', e.from)} ─── ${c('yellow', e.to)}  ${String(e.weight).padStart(4)}m ${mark}`);
    });
    console.log(c('cyan', '  └─────────────────────────────────────────────\n'));
  }
}

// ── Union-Find (Kruskal cycle detection) ──────────────────────────────────────

class UnionFind {
  constructor(nodes) {
    this.parent = {};
    this.rank   = {};
    for (const n of nodes) { this.parent[n] = n; this.rank[n] = 0; }
  }

  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]); // path compression
    return this.parent[x];
  }

  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false; // same component → cycle
    if (this.rank[ra] < this.rank[rb])      this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else { this.parent[rb] = ra; this.rank[ra]++; }
    return true;
  }
}

// ── Min-Heap (Prim frontier) ──────────────────────────────────────────────────

class MinHeap {
  constructor() { this.heap = []; }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (!this.heap.length) return null;
    const min  = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length) { this.heap[0] = last; this._siftDown(0); }
    return min;
  }

  get size() { return this.heap.length; }

  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p].weight <= this.heap[i].weight) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l].weight < this.heap[s].weight) s = l;
      if (r < n && this.heap[r].weight < this.heap[s].weight) s = r;
      if (s === i) break;
      [this.heap[s], this.heap[i]] = [this.heap[i], this.heap[s]];
      i = s;
    }
  }
}

// ── Kruskal's algorithm ─────────────────────────────────────────

function kruskal(graph) {
  const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const uf     = new UnionFind([...graph.nodes]);
  const mst = [], log = [];
  let total = 0;

  log.push(dim(`  Kruskal — sorting ${sorted.length} edge(s) by weight`));

  for (const e of sorted) {
    const label = `${e.from} ─── ${e.to} [${e.weight}m]`;
    if (uf.union(e.from, e.to)) {
      mst.push(e);
      total += e.weight;
      log.push(`  ${c('green', '✓ PICK')}  ${c('yellow', label)}`);
      if (mst.length === graph.nodes.size - 1) break; // MST complete
    } else {
      log.push(`  ${c('red', '✗ SKIP')}  ${dim(label)}  ${dim('(cycle)')}`);
    }
  }

  return { mst, total, log };
}

// ── Prim's algorithm ────────────────────────────────────────────

function prim(graph, startNode) {
  const nodes = [...graph.nodes];
  if (!nodes.length) return { mst: [], total: 0, log: [] };

  const start = startNode || nodes[0];
  if (!graph.nodes.has(start))
    return { mst: [], total: 0, log: [`  ${c('red', 'Start node not found')}`] };

  const visited = new Set([start]);
  const heap    = new MinHeap();
  const mst = [], log = [];
  let total = 0;

  log.push(dim(`  Prim — starting from ${start}`));

  // Seed heap with all edges from start
  for (const nb of graph.adjacency.get(start))
    heap.push({ from: start, to: nb.to, weight: nb.weight });

  while (heap.size && mst.length < nodes.length - 1) {
    const { from, to, weight } = heap.pop();
    const label = `${from} ─── ${to} [${weight}m]`;

    if (visited.has(to)) {
      log.push(`  ${c('red', '✗ SKIP')}  ${dim(label)}  ${dim('(already visited)')}`);
      continue;
    }

    visited.add(to);
    mst.push({ from, to, weight });
    total += weight;
    log.push(`  ${c('green', '✓ PICK')}  ${c('yellow', label)}`);

    // Expand frontier
    for (const nb of graph.adjacency.get(to))
      if (!visited.has(nb.to)) heap.push({ from: to, to: nb.to, weight: nb.weight });
  }

  return { mst, total, log };
}

// ── Print MST result ──────────────────────────────────────────────────────────

function printResult(result, algo) {
  const { mst, total, log } = result;

  console.log('\n' + c('magenta', bold(`  ┌─ ${algo.toUpperCase()} LOG ${'─'.repeat(35 - algo.length)}`)));
  log.forEach(l => console.log('  │' + l));
  console.log(c('magenta', '  └' + '─'.repeat(47)));

  if (!mst.length) {
    console.log(c('red', '\n  ✗ MST failed — graph may not be connected\n'));
    return new Set();
  }

  console.log('\n' + c('green', bold('  ╔══ MST CONNECTIONS ══════════════════════════╗')));
  mst.forEach((e, i) =>
    console.log(`  ║  ${String(i + 1).padStart(2)}.  ${c('yellow', e.from.padEnd(6))} ───── ${c('yellow', e.to.padEnd(6))}  ${String(e.weight).padStart(4)}m`)
  );
  console.log(c('green', '  ╠══════════════════════════════════════════════╣'));
  console.log(`  ║  ${bold('TOTAL COST:')}  ${c('green', bold(total + ' m'))}${' '.repeat(Math.max(0, 29 - String(total).length))}║`);
  console.log(`  ║  Edges: ${mst.length}  /  Nodes: ${mst.length + 1}${' '.repeat(Math.max(0, 26 - String(mst.length).length))}║`);
  console.log(c('green', '  ╚══════════════════════════════════════════════╝\n'));

  return new Set(mst.map(e => `${e.from}-${e.to}`));
}

// ── Interactive CLI (Bonus: dynamic node/edge input) ─────────────────────────

class MST_CLI {
  constructor() {
    this.graph      = new Graph();
    this.rl         = readline.createInterface({ input: process.stdin, output: process.stdout });
    this.lastMSTSet = new Set();
  }

  prompt(q) { return new Promise(res => this.rl.question(q, res)); }

  banner() {
    console.clear();
    console.log(c('cyan', bold('\n  ╔══════════════════════════════════════════════════╗')));
    console.log(c('cyan', bold('  ║       MST CABLE LAYOUT — Office Network          ║')));
    console.log(c('cyan', bold('  ║       Kruskal (Union-Find) · Prim (Min-Heap)     ║')));
    console.log(c('cyan', bold('  ╚══════════════════════════════════════════════════╝\n')));
  }

  menu() {
    console.log(c('cyan', '  ┌─ MENU ──────────────────────────────────────────'));
    [
      ['1', 'Add a computer (node)'],
      ['2', 'Add a cable connection (edge + weight)'],
      ['3', 'Show current graph'],
      ['4', 'Compute MST — Kruskal'],
      ['5', 'Compute MST — Prim'],
      ['6', 'Load demo graph'],
      ['0', 'Quit'],
    ].forEach(([k, v]) => console.log(`  │  ${c('yellow', k)}  ${v}`));
    console.log(c('cyan', '  └─────────────────────────────────────────────────\n'));
  }

  async addNode() {
    const input = await this.prompt(c('yellow', '  PC name (e.g. C1, SERVER): '));
    const label = input.trim().toUpperCase();
    if (!label) { console.log(c('red', '  ✗ Empty name.\n')); return; }
    this.graph.addNode(label)
      ? console.log(c('green', `  ✓ "${label}" added.\n`))
      : console.log(c('red', `  ✗ "${label}" already exists.\n`));
  }

  async addEdge() {
    const nodes = [...this.graph.nodes];
    if (nodes.length < 2) { console.log(c('red', '  ✗ Need at least 2 nodes first.\n')); return; }
    console.log(dim(`  Available: ${nodes.join(', ')}`));
    const from   = (await this.prompt(c('yellow', '  From   : '))).trim().toUpperCase();
    const to     = (await this.prompt(c('yellow', '  To     : '))).trim().toUpperCase();
    const weight = parseInt((await this.prompt(c('yellow', '  Cost(m): '))).trim());
    if (!from || !to)                 { console.log(c('red', '  ✗ Invalid node.\n')); return; }
    if (isNaN(weight) || weight <= 0) { console.log(c('red', '  ✗ Invalid weight.\n')); return; }
    this.graph.addEdge(from, to, weight)
      ? console.log(c('green', `  ✓ ${from} ─── ${to} (${weight}m) added.\n`))
      : console.log(c('red', '  ✗ Invalid or duplicate edge.\n'));
  }

  showGraph() {
    if (!this.graph.nodes.size) { console.log(c('red', '\n  ✗ Empty graph.\n')); return; }
    console.log(dim(`\n  Graph: ${this.graph.nodes.size} node(s), ${this.graph.edges.length} edge(s)\n`));
    this.graph.printAdjacency();
    this.graph.printEdges(this.lastMSTSet);
  }

  async runKruskal() {
    if (this.graph.nodes.size < 2) { console.log(c('red', '\n  ✗ Not enough nodes.\n')); return; }
    this.lastMSTSet = printResult(kruskal(this.graph), 'Kruskal');
    this.graph.printEdges(this.lastMSTSet);
  }

  async runPrim() {
    if (this.graph.nodes.size < 2) { console.log(c('red', '\n  ✗ Not enough nodes.\n')); return; }
    const nodes = [...this.graph.nodes];
    console.log(dim(`  Available: ${nodes.join(', ')}`));
    const input = await this.prompt(c('yellow', `  Start node [Enter = ${nodes[0]}]: `));
    const start = input.trim().toUpperCase() || nodes[0];
    this.lastMSTSet = printResult(prim(this.graph, start), 'Prim');
    this.graph.printEdges(this.lastMSTSet);
  }

  loadDemo() {
    this.graph      = new Graph();
    this.lastMSTSet = new Set();
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].forEach(n => this.graph.addNode(n));
    [
      ['C1', 'C2',  4], ['C1', 'C3',  3],
      ['C2', 'C3',  1], ['C2', 'C4',  2],
      ['C3', 'C5',  5], ['C4', 'C5',  7],
      ['C4', 'C6',  6], ['C5', 'C6',  8],
      ['C1', 'C6', 10],
    ].forEach(([a, b, w]) => this.graph.addEdge(a, b, w));
    console.log(c('green', '\n  ✓ Demo graph loaded (6 PCs, 9 cables)\n'));
  }

  async run() {
    this.banner();
    this.loadDemo();

    while (true) {
      this.menu();
      const choice = (await this.prompt(c('cyan', '  Choice: '))).trim();
      switch (choice) {
        case '1': await this.addNode();    break;
        case '2': await this.addEdge();    break;
        case '3': this.showGraph();        break;
        case '4': await this.runKruskal(); break;
        case '5': await this.runPrim();    break;
        case '6': this.loadDemo();         break;
        case '0':
          console.log(c('cyan', '\n  Goodbye.\n'));
          this.rl.close();
          process.exit(0);
        default:
          console.log(c('red', '  ✗ Invalid option.\n'));
      }
      await this.prompt(dim('  [Enter to continue...]'));
      this.banner();
    }
  }
}

new MST_CLI().run();