const ConsistentHash = require("./ConsistentHash");
const StorageNode = require("./Node");
const LRUCache = require("./Cache");

class DistributedStore {
  constructor(cacheCapacity = 5) {
    this.ring = new ConsistentHash();
    this.nodes = new Map(); // nodeId -> StorageNode
    this.cache = new LRUCache(cacheCapacity);
  }

  // ── Node management ────────────────────────────────────────────────────────

  addNode(nodeId) {
    const node = new StorageNode(nodeId);
    this.nodes.set(nodeId, node);
    this.ring.addNode(nodeId);
    console.log(`  [+] Node "${nodeId}" added to the cluster`);
    this._rebalance();
  }

  removeNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Migrate data before removing from ring
    this.ring.removeNode(nodeId);
    for (const [key, value] of node.entries()) {
      const targetId = this.ring.getNode(key);
      if (targetId) {
        this.nodes.get(targetId).set(key, value);
        console.log(`  [migrate] "${key}" → node "${targetId}"`);
      }
    }

    this.nodes.delete(nodeId);
    console.log(`  [-] Node "${nodeId}" removed from the cluster`);
  }

  failNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node) node.fail();
  }

  // ── Data operations (transparent API) ─────────────────────────────────────

  set(key, value) {
    const nodeId = this.ring.getNode(key);
    if (!nodeId) throw new Error("No nodes available");

    const node = this.nodes.get(nodeId);
    node.set(key, value);
    this.cache.set(key, value);
    console.log(`  [set] "${key}" → node "${nodeId}"`);
  }

  get(key) {
    // Cache hit
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      console.log(`  [get] "${key}" → CACHE HIT`);
      return value;
    }

    // Route to responsible node
    const nodeId = this.ring.getNode(key);
    if (!nodeId) return null;

    const node = this.nodes.get(nodeId);
    try {
      const value = node.get(key);
      if (value !== null) this.cache.set(key, value);
      console.log(`  [get] "${key}" → node "${nodeId}"`);
      return value;
    } catch {
      // Node is down — try next available node (limited availability)
      console.log(`  [!] Node "${nodeId}" is down, trying next node...`);
      const fallbackId = this.ring.getNextNode(key, nodeId);
      if (!fallbackId) return null;
      try {
        const value = this.nodes.get(fallbackId).get(key);
        console.log(`  [get] "${key}" → fallback node "${fallbackId}" (stale)`);
        return value;
      } catch {
        return null;
      }
    }
  }

  delete(key) {
    const nodeId = this.ring.getNode(key);
    if (!nodeId) return;
    this.nodes.get(nodeId).delete(key);
    this.cache.invalidate(key);
    console.log(`  [del] "${key}" removed from node "${nodeId}"`);
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  // After adding a new node, move keys that now belong to it
  _rebalance() {
    for (const [nodeId, node] of this.nodes) {
      for (const [key] of node.entries()) {
        const responsibleId = this.ring.getNode(key);
        if (responsibleId !== nodeId) {
          const value = node.store.get(key);
          this.nodes.get(responsibleId).set(key, value);
          node.store.delete(key);
          console.log(`  [rebalance] "${key}" → node "${responsibleId}"`);
        }
      }
    }
  }

  // ── Debug ──────────────────────────────────────────────────────────────────

  printState() {
    console.log("\n  === Cluster State ===");
    for (const [nodeId, node] of this.nodes) {
      const status = node.isAlive ? "UP" : "DOWN";
      const keys = node.entries().map(([k]) => k).join(", ") || "(empty)";
      console.log(`  Node "${nodeId}" [${status}] → keys: ${keys}`);
    }
    console.log(`  Cache size: ${this.cache.size()}/${this.cache.capacity}`);
    console.log("  ====================\n");
  }
}

module.exports = DistributedStore;
