// Utility: wraps setTimeout in a Promise
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Task 01 — Iterating with Async/Await
async function iterateWithAsyncAwait(values) {
  for (const value of values) {
    await delay(1000);
    console.log(value);
  }
}

// Task 02 — Awaiting a Call (simulated API)
async function awaitCall() {
  const fakeApi = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ user: "Alice", score: 42 }), 1000)
    );

  const data = await fakeApi();
  console.log("API response:", data);
}

// Task 03 — Handling Errors with Async/Await
async function awaitCallWithErrorHandling(shouldFail = false) {
  const fakeApi = (fail) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (fail) reject(new Error("Network error: could not reach the API"));
        else resolve({ user: "Bob", score: 99 });
      }, 1000)
    );

  try {
    const data = await fakeApi(shouldFail);
    console.log("API response:", data);
  } catch (error) {
    console.error("Something went wrong:", error.message);
  }
}

// Task 04 — Chaining Async/Await
async function stepOne() {
  await delay(1000);
  console.log("Step 1 complete");
}

async function stepTwo() {
  await delay(1000);
  console.log("Step 2 complete");
}

async function stepThree() {
  await delay(1000);
  console.log("Step 3 complete");
}

async function chainedAsyncFunctions() {
  await stepOne();
  await stepTwo();
  await stepThree();
}

// Task 05a — Awaiting Concurrent Requests
async function concurrentRequests() {
  const fakeRequest = (id) =>
    new Promise((resolve) =>
      setTimeout(() => resolve(`Response from API ${id}`), 1000)
    );

  const [result1, result2] = await Promise.all([fakeRequest(1), fakeRequest(2)]);
  console.log("Concurrent results:", result1, "|", result2);
}

// Task 05b — Awaiting Parallel Calls
async function parallelCalls(urls) {
  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const data = await Promise.all(responses.map((res) => res.json()));
  console.log("Parallel results:", data);
}

// --- Run all tasks ---
(async () => {
  console.log("=== Task 01: Iterating with Async/Await ===");
  await iterateWithAsyncAwait(["apple", "banana", "cherry"]);

  console.log("\n=== Task 02: Awaiting a Call ===");
  await awaitCall();

  console.log("\n=== Task 03: Handling Errors (success) ===");
  await awaitCallWithErrorHandling(false);

  console.log("\n=== Task 03: Handling Errors (failure) ===");
  await awaitCallWithErrorHandling(true);

  console.log("\n=== Task 04: Chaining Async Functions ===");
  await chainedAsyncFunctions();

  console.log("\n=== Task 05a: Concurrent Requests ===");
  await concurrentRequests();

  console.log("\n=== Task 05b: Parallel Calls (requires network) ===");
  await parallelCalls([
    "https://jsonplaceholder.typicode.com/todos/1",
    "https://jsonplaceholder.typicode.com/todos/2",
  ]);
})();
