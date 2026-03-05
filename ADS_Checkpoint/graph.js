const readline = require("readline");

// ── GRAPH CLASS ──────────────────────────────────────────────────────────────

class Graph {
  // directed: true = edges are one-way, false = edges go both ways
  constructor(directed = false) {
    this.adjacencyList = {};
    this.directed = directed;
  }

  // Add a vertex to the graph if it doesn't already exist
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  // Add an edge between v1 and v2
  // If undirected, the edge is added in both directions
  // Prevents duplicate edges
  addEdge(v1, v2) {
    this.addVertex(v1);
    this.addVertex(v2);
    // Only add if the edge does not already exist
    if (!this.adjacencyList[v1].includes(v2)) {
      this.adjacencyList[v1].push(v2);
    }
    if (!this.directed && !this.adjacencyList[v2].includes(v1)) {
      this.adjacencyList[v2].push(v1);
    }
  }

  // Remove the edge between v1 and v2
  // If undirected, remove from both sides
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1]?.filter(v => v !== v2) || [];
    if (!this.directed) {
      this.adjacencyList[v2] = this.adjacencyList[v2]?.filter(v => v !== v1) || [];
    }
  }

  // Return true if an edge exists from v1 to v2
  hasEdge(v1, v2) {
    return this.adjacencyList[v1]?.includes(v2) || false;
  }

  // Print the full adjacency list
  print() {
    const vertices = Object.keys(this.adjacencyList);
    if (vertices.length === 0) {
      console.log("  (empty graph)");
      return;
    }
    for (let vertex of vertices) {
      console.log(`  ${vertex} → [${this.adjacencyList[vertex].join(", ")}]`);
    }
  }

  // DFS — Depth-First Search (recursive)
  // Explores as far as possible along each branch before backtracking
  dfs(start) {
    if (!this.adjacencyList[start]) return [];
    const visited = {}, result = [];

    const explore = (vertex) => {
      if (!vertex || visited[vertex]) return;
      visited[vertex] = true;
      result.push(vertex);
      // Recurse into each unvisited neighbor
      for (let neighbor of this.adjacencyList[vertex]) {
        if (!visited[neighbor]) explore(neighbor);
      }
    };

    explore(start);
    return result;
  }

  // BFS — Breadth-First Search (queue)
  // Visits all neighbors at the current depth before going deeper
  bfs(start) {
    if (!this.adjacencyList[start]) return [];
    const visited = { [start]: true };
    const queue = [start]; // FIFO queue
    const result = [];

    while (queue.length > 0) {
      const vertex = queue.shift(); // dequeue the first element
      result.push(vertex);

      // Enqueue all unvisited neighbors
      for (let neighbor of this.adjacencyList[vertex]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }

    return result;
  }
}

// ── INTERACTIVE CLI ──────────────────────────────────────────────────────────

// Initialize an undirected graph by default
let graph = new Graph();

// readline interface to read user input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Wrap rl.question in a Promise so we can use async/await
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// Display the main menu
function showMenu() {
  console.log("\n┌─────────────────────────────────┐");
  console.log("│         GRAPH MENU              │");
  console.log("├─────────────────────────────────┤");
  console.log("│  1. Add edge                    │");
  console.log("│  2. Remove edge                 │");
  console.log("│  3. Check edge (hasEdge)        │");
  console.log("│  4. Print graph                 │");
  console.log("│  5. DFS traversal               │");
  console.log("│  6. BFS traversal               │");
  console.log("│  7. Switch directed/undirected  │");
  console.log("│  8. Reset graph                 │");
  console.log("│  0. Exit                        │");
  console.log("└─────────────────────────────────┘");
  console.log(`  Mode: ${graph.directed ? "Directed" : "Undirected"}`);
}

// Main loop — keeps running until the user exits
async function main() {
  console.log("\n🔷 Welcome to the Interactive Graph Explorer!");
  console.log("   Start by adding edges between vertices.");

  while (true) {
    showMenu();
    const choice = (await ask("\nYour choice: ")).trim();

    switch (choice) {
      case "1": {
        // Add a new edge between two vertices
        const v1 = (await ask("  First vertex:  ")).trim();
        const v2 = (await ask("  Second vertex: ")).trim();
        graph.addEdge(v1, v2);
        console.log(`  ✅ Edge added: ${v1} → ${v2}`);
        break;
      }
      case "2": {
        // Remove an existing edge
        const v1 = (await ask("  First vertex:  ")).trim();
        const v2 = (await ask("  Second vertex: ")).trim();
        graph.removeEdge(v1, v2);
        console.log(`  ✅ Edge removed: ${v1} — ${v2}`);
        break;
      }
      case "3": {
        // Check whether a direct edge exists between two vertices
        const v1 = (await ask("  First vertex:  ")).trim();
        const v2 = (await ask("  Second vertex: ")).trim();
        const exists = graph.hasEdge(v1, v2);
        console.log(`  Edge ${v1} → ${v2}: ${exists ? "✅ exists" : "❌ does not exist"}`);
        await ask("\n  Press Enter to continue...");
        break;
      }
      case "4": {
        // Print the current adjacency list
        console.log("\n  ── Graph structure ──────────────────");
        graph.print();
        console.log("  ─────────────────────────────────────");
        await ask("\n  Press Enter to continue...");
        break;
      }
      case "5": {
        // Run DFS from a chosen starting vertex
        const start = (await ask("  Start vertex: ")).trim();
        const result = graph.dfs(start);
        if (result.length === 0) {
          console.log(`  ❌ Vertex "${start}" not found in graph.`);
        } else {
          console.log(`  DFS: ${result.join(" → ")}`);
        }
        await ask("\n  Press Enter to continue...");
        break;
      }
      case "6": {
        // Run BFS from a chosen starting vertex
        const start2 = (await ask("  Start vertex: ")).trim();
        const result2 = graph.bfs(start2);
        if (result2.length === 0) {
          console.log(`  ❌ Vertex "${start2}" not found in graph.`);
        } else {
          console.log(`  BFS: ${result2.join(" → ")}`);
        }
        await ask("\n  Press Enter to continue...");
        break;
      }
      case "7": {
        // Toggle between directed and undirected mode
        graph.directed = !graph.directed;
        console.log(`  Switched to: ${graph.directed ? "Directed" : "Undirected"}`);
        break;
      }
      case "8": {
        // Reset the graph while keeping the current mode
        graph = new Graph(graph.directed);
        console.log("  ✅ Graph reset.");
        break;
      }
      case "0": {
        console.log("\n  Bye! 👋\n");
        rl.close();
        process.exit(0);
      }
      default:
        console.log("  ⚠️  Invalid choice. Please enter a number from 0 to 8.");
    }
  }
}

// ── AUTOMATED TESTS ──────────────────────────────────────────────────────────

function runTests() {
  let passed = 0;
  let failed = 0;

  // Helper to assert equality
  function assert(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (ok) {
      console.log(`  ✅ ${label}`);
      passed++;
    } else {
      console.log(`  ❌ ${label}`);
      console.log(`     Expected: ${JSON.stringify(expected)}`);
      console.log(`     Got:      ${JSON.stringify(actual)}`);
      failed++;
    }
  }

  console.log("\n━━━ AUTOMATED TESTS ━━━\n");

  // ── Test 1: Undirected graph with 5 vertices ─────────────────────────────
  console.log("► Undirected graph (A–B–C–D–E)");
  const g = new Graph();
  g.addEdge("A", "B");
  g.addEdge("A", "C");
  g.addEdge("B", "D");
  g.addEdge("C", "D");
  g.addEdge("D", "E");

  assert("DFS from A", g.dfs("A"), ["A", "B", "D", "C", "E"]);
  assert("BFS from A", g.bfs("A"), ["A", "B", "C", "D", "E"]);
  assert("hasEdge(A, B) → true",  g.hasEdge("A", "B"), true);
  assert("hasEdge(B, A) → true (undirected)", g.hasEdge("B", "A"), true);
  assert("hasEdge(A, D) → false", g.hasEdge("A", "D"), false);

  // ── Test 2: No duplicate edges ────────────────────────────────────────────
  console.log("\n► Duplicate edge prevention");
  g.addEdge("A", "B"); // add same edge again
  assert("No duplicate: A→B has 1 entry", g.adjacencyList["A"].filter(v => v === "B").length, 1);
  assert("No duplicate: B→A has 1 entry", g.adjacencyList["B"].filter(v => v === "A").length, 1);

  // ── Test 3: removeEdge ────────────────────────────────────────────────────
  console.log("\n► removeEdge");
  g.removeEdge("A", "B");
  assert("hasEdge(A, B) → false after removal", g.hasEdge("A", "B"), false);
  assert("hasEdge(B, A) → false after removal (undirected)", g.hasEdge("B", "A"), false);

  // ── Test 4: Directed graph with 4 vertices ────────────────────────────────
  console.log("\n► Directed graph (X→Y→Z→W)");
  const dg = new Graph(true);
  dg.addEdge("X", "Y");
  dg.addEdge("X", "Z");
  dg.addEdge("Y", "Z");
  dg.addEdge("Z", "W");

  assert("DFS from X", dg.dfs("X"), ["X", "Y", "Z", "W"]);
  assert("BFS from X", dg.bfs("X"), ["X", "Y", "Z", "W"]);
  assert("hasEdge(X, Y) → true",  dg.hasEdge("X", "Y"), true);
  assert("hasEdge(Y, X) → false (directed)", dg.hasEdge("Y", "X"), false);

  // ── Test 5: Unknown vertex ────────────────────────────────────────────────
  console.log("\n► Unknown vertex");
  assert("DFS from unknown vertex → []", g.dfs("Z"), []);
  assert("BFS from unknown vertex → []", g.bfs("Z"), []);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n  ${passed} passed, ${failed} failed`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━\n");
}

runTests();
main();
