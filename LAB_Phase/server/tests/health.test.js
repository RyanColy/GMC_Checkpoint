const request = require("supertest");

// Load env before importing app so dotenv is configured
process.env.MONGO_URI = "mongodb://localhost:27017/nextalk_test";
process.env.JWT_SECRET = "test_secret";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.NODE_ENV = "test";

// Mock mongoose connect so tests don't need a real DB
jest.mock("../config/db", () => jest.fn());

const { app } = require("../server");

describe("Health check", () => {
  it("GET /api/health returns status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
