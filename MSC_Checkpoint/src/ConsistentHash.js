const crypto = require("crypto");

const VIRTUAL_NODES = 100;

function hash(key) {
  return parseInt(crypto.createHash("md5").update(key).digest("hex").slice(0, 8), 16);
}

class ConsistentHash {
  constructor() {
    this.ring = new Map(); // hash position -> nodeId
    this.sortedPositions = [];
    this.nodes = new Set();
  }

  addNode(nodeId) {
    this.nodes.add(nodeId);
    for (let i = 0; i < VIRTUAL_NODES; i++) {
      const pos = hash(`${nodeId}:${i}`);
      this.ring.set(pos, nodeId);
      this.sortedPositions.push(pos);
    }
    this.sortedPositions.sort((a, b) => a - b);
  }

  removeNode(nodeId) {
    this.nodes.delete(nodeId);
    for (let i = 0; i < VIRTUAL_NODES; i++) {
      const pos = hash(`${nodeId}:${i}`);
      this.ring.delete(pos);
    }
    this.sortedPositions = this.sortedPositions.filter(
      (p) => this.ring.has(p)
    );
  }

  getNode(key) {
    if (this.sortedPositions.length === 0) return null;
    const keyHash = hash(key);
    for (const pos of this.sortedPositions) {
      if (keyHash <= pos) return this.ring.get(pos);
    }
    // wrap around to first node
    return this.ring.get(this.sortedPositions[0]);
  }

  // Returns the next alive node after the one responsible for the key
  getNextNode(key, excludeNodeId) {
    const keyHash = hash(key);
    const candidates = this.sortedPositions.filter(
      (p) => this.ring.get(p) !== excludeNodeId
    );
    if (candidates.length === 0) return null;
    for (const pos of candidates) {
      if (keyHash <= pos) return this.ring.get(pos);
    }
    return this.ring.get(candidates[0]);
  }

  getNodes() {
    return [...this.nodes];
  }
}

module.exports = ConsistentHash;
