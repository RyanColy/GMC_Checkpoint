const http = require('http');
const { URL } = require('url');

const PORT = 3000;

// In-memory storage for tasks
let tasks = [];
let nextId = 1;

// Reads and parses the JSON body from the request stream
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to send a JSON response with the given status code
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(data !== undefined ? JSON.stringify(data) : '');
}

const server = http.createServer(async (req, res) => {
  const baseUrl = `http://localhost:${PORT}`;
  const pathname = new URL(req.url, baseUrl).pathname;
  const method = req.method;

  // GET /tasks — return all tasks
  if (pathname === '/tasks' && method === 'GET') {
    return send(res, 200, tasks);
  }

  // POST /tasks — create a new task
  if (pathname === '/tasks' && method === 'POST') {
    let body;
    try { body = await parseBody(req); }
    catch { return send(res, 400, { error: 'Invalid JSON' }); }

    // title is required
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return send(res, 400, { error: 'title is required' });
    }

    const task = { id: nextId++, title: body.title.trim(), completed: false };
    tasks.push(task);
    return send(res, 201, task);
  }

  // Routes that require an :id parameter
  if (pathname.startsWith('/tasks/')) {
    const id = parseInt(pathname.split('/')[2]);
    if (isNaN(id)) return send(res, 400, { error: 'Invalid id' });

    // Find the task index in the array
    const index = tasks.findIndex(t => t.id === id);

    // GET /tasks/:id — return a single task
    if (method === 'GET') {
      if (index === -1) return send(res, 404, { error: 'Task not found' });
      return send(res, 200, tasks[index]);
    }

    // PUT /tasks/:id — update title and/or completed
    if (method === 'PUT') {
      if (index === -1) return send(res, 404, { error: 'Task not found' });

      let body;
      try { body = await parseBody(req); }
      catch { return send(res, 400, { error: 'Invalid JSON' }); }

      if (body.title !== undefined) {
        if (typeof body.title !== 'string' || !body.title.trim()) {
          return send(res, 400, { error: 'title must be a non-empty string' });
        }
        tasks[index].title = body.title.trim();
      }
      if (body.completed !== undefined) {
        if (typeof body.completed !== 'boolean') {
          return send(res, 400, { error: 'completed must be a boolean' });
        }
        tasks[index].completed = body.completed;
      }
      return send(res, 200, tasks[index]);
    }

    // DELETE /tasks/:id — remove a task
    if (method === 'DELETE') {
      if (index === -1) return send(res, 404, { error: 'Task not found' });
      tasks.splice(index, 1);
      return send(res, 204);
    }
  }

  // No matching route found
  send(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
