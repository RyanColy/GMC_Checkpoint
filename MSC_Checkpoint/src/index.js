const DistributedStore = require("./DistributedStore");

const store = new DistributedStore(4); // cache capacity: 4 entries

const users = [
  ["user:101", { name: "Alice" }],
  ["user:102", { name: "Bob" }],
  ["user:103", { name: "Charlie" }],
  ["user:104", { name: "Diana" }],
  ["user:105", { name: "Eve" }],
  ["user:106", { name: "Frank" }],
];

// ─────────────────────────────────────────────────────────────────
console.log("=== 1. Starting cluster with 3 nodes ===");
store.addNode("node-A");
store.addNode("node-B");
store.addNode("node-C");

console.log("\n=== 2. Writing all users ===");
for (const [key, value] of users) {
  store.set(key, JSON.stringify(value));
}
store.printState();

// ─────────────────────────────────────────────────────────────────
console.log("=== 3. Reading users (first read → from node) ===");
for (const [key] of users) {
  const val = store.get(key);
  console.log(`     ${key} = ${val}`);
}

console.log("\n=== 4. Reading again (should hit cache) ===");
for (const [key] of users) {
  store.get(key);
}

// ─────────────────────────────────────────────────────────────────
console.log("\n=== 5. Adding a new node (node-D) — triggers rebalance ===");
store.addNode("node-D");
store.printState();

// ─────────────────────────────────────────────────────────────────
console.log("=== 6. Removing node-B — data migrated automatically ===");
store.removeNode("node-B");
store.printState();

// ─────────────────────────────────────────────────────────────────
console.log("=== 7. Simulating failure of node-A ===");
store.failNode("node-A");
console.log("\nReading user:101 (may be on failed node):");
const val = store.get("user:101");
console.log(`  Result: ${val ?? "(unavailable)"}\n`);

// ─────────────────────────────────────────────────────────────────
console.log("=== 8. Final cluster state ===");
store.printState();
