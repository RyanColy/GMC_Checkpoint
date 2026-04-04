function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();

  // Initialize all distances to Infinity, start node to 0
  for (const vertex in graph) {
    distances[vertex] = Infinity;
  }
  distances[start] = 0;

  while (true) {
    // Pick the unvisited vertex with the smallest known distance
    let current = null;
    for (const vertex in distances) {
      if (!visited.has(vertex)) {
        if (current === null || distances[vertex] < distances[current]) {
          current = vertex;
        }
      }
    }

    // All remaining vertices are unreachable
    if (current === null || distances[current] === Infinity) break;

    visited.add(current);

    // Relax neighbors
    for (const neighbor in graph[current]) {
      const newDist = distances[current] + graph[current][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
      }
    }
  }

  return distances;
}

// Test
const graph = {
  'A': { 'B': 4, 'C': 2 },
  'B': { 'A': 4, 'C': 5, 'D': 10 },
  'C': { 'A': 2, 'B': 5, 'D': 3 },
  'D': { 'B': 10, 'C': 3 }
};

console.log(dijkstra(graph, 'A'));
// { A: 0, B: 4, C: 2, D: 5 }