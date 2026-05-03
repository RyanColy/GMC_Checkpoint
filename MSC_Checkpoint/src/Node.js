class StorageNode {
  constructor(id) {
    this.id = id;
    this.store = new Map();
    this.isAlive = true;
  }

  get(key) {
    if (!this.isAlive) throw new Error(`Node ${this.id} is down`);
    return this.store.get(key) ?? null;
  }

  set(key, value) {
    if (!this.isAlive) throw new Error(`Node ${this.id} is down`);
    this.store.set(key, value);
  }

  delete(key) {
    if (!this.isAlive) throw new Error(`Node ${this.id} is down`);
    this.store.delete(key);
  }

  // Returns all keys stored on this node (used for data migration)
  entries() {
    return [...this.store.entries()];
  }

  fail() {
    this.isAlive = false;
    console.log(`  [!] Node ${this.id} has FAILED`);
  }

  recover() {
    this.isAlive = true;
    console.log(`  [+] Node ${this.id} has RECOVERED`);
  }
}

module.exports = StorageNode;
