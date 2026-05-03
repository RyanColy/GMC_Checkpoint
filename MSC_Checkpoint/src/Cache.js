class LRUCache {
  constructor(capacity = 5) {
    this.capacity = capacity;
    // Map preserves insertion order — we exploit this for LRU eviction
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first entry)
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
      console.log(`  [cache] Evicted LRU key: "${lruKey}"`);
    }
    this.cache.set(key, value);
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  size() {
    return this.cache.size;
  }
}

module.exports = LRUCache;
