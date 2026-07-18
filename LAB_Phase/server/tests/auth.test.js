const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.NODE_ENV = "test";

// Mock cloudinary so storage.js doesn't fail without real credentials
jest.mock("../config/storage", () => ({
  upload: { single: () => (req, res, next) => next() },
  cloudinary: {},
}));

jest.mock("../config/db", () => jest.fn());

const { app } = require("../server");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

const validUser = {
  displayName: "Test User",
  handle: "testuser",
  email: "test@example.com",
  password: "password123",
};

describe("POST /api/auth/register", () => {
  it("creates a new user and returns token", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.handle).toBe("testuser");
  });

  it("rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already taken/i);
  });

  it("rejects duplicate handle", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, email: "other@example.com" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(validUser);
  });

  it("returns token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("rejects unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/users/search", () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);
    token = res.body.token;
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/users/search?q=test");
    expect(res.status).toBe(401);
  });

  it("returns users matching handle", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ displayName: "Other", handle: "testother", email: "other@example.com", password: "pass123" });

    const res = await request(app)
      .get("/api/users/search?q=testother")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.some((u) => u.handle === "testother")).toBe(true);
    expect(res.body.some((u) => u.handle === "testuser")).toBe(false);
  });

  it("returns users matching displayName", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ displayName: "John Doe", handle: "johndoe", email: "john@example.com", password: "pass123" });

    const res = await request(app)
      .get("/api/users/search?q=John")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.some((u) => u.handle === "johndoe")).toBe(true);
  });
});
