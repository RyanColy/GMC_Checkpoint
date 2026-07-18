const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.NODE_ENV = "test";

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

const createUser = (suffix) =>
  request(app).post("/api/auth/register").send({
    displayName: `User ${suffix}`,
    handle: `user${suffix}`,
    email: `user${suffix}@example.com`,
    password: "password123",
  });

describe("POST /api/conversations", () => {
  it("creates a conversation between two users", async () => {
    const resA = await createUser("A");
    const resB = await createUser("B");
    const tokenA = resA.body.token;
    const userBId = resB.body.user.id;

    const res = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ participantId: userBId });

    expect(res.status).toBe(200);
    expect(res.body.participants).toHaveLength(2);
  });

  it("returns existing conversation on second call", async () => {
    const resA = await createUser("A");
    const resB = await createUser("B");
    const tokenA = resA.body.token;
    const userBId = resB.body.user.id;

    const first = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ participantId: userBId });

    const second = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ participantId: userBId });

    expect(first.body._id).toBe(second.body._id);
  });
});

describe("GET /api/conversations", () => {
  it("returns user conversations sorted by updatedAt", async () => {
    const resA = await createUser("A");
    const resB = await createUser("B");
    const tokenA = resA.body.token;
    const userBId = resB.body.user.id;

    await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ participantId: userBId });

    const res = await request(app)
      .get("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("GET /api/messages/:conversationId", () => {
  it("returns empty array for new conversation", async () => {
    const resA = await createUser("A");
    const resB = await createUser("B");
    const tokenA = resA.body.token;
    const userBId = resB.body.user.id;

    const conv = await request(app)
      .post("/api/conversations")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ participantId: userBId });

    const res = await request(app)
      .get(`/api/messages/${conv.body._id}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
