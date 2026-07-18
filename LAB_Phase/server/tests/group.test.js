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

describe("POST /api/groups", () => {
  it("creates a group with at least 2 members", async () => {
    const resA = await createUser("A");
    const resB = await createUser("B");
    const tokenA = resA.body.token;
    const userBId = resB.body.user.id;

    const res = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Test Group", memberIds: [userBId] });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Group");
    expect(res.body.members).toHaveLength(2);
  });

  it("rejects group with only the creator", async () => {
    const resA = await createUser("A");
    const res = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${resA.body.token}`)
      .send({ name: "Solo", memberIds: [] });

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/groups/:id/members + leave", () => {
  let tokenA, tokenC, groupId, userCId;

  beforeEach(async () => {
    const resA = await createUser("A");
    const resB = await createUser("B");
    const resC = await createUser("C");
    tokenA = resA.body.token;
    tokenC = resC.body.token;
    userCId = resC.body.user.id;

    const grp = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Group", memberIds: [resB.body.user.id] });
    groupId = grp.body._id;
  });

  it("admin can add a member", async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/members`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ userId: userCId });

    expect(res.status).toBe(200);
    expect(res.body.members).toHaveLength(3);
  });

  it("member can leave the group", async () => {
    await request(app)
      .post(`/api/groups/${groupId}/members`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ userId: userCId });

    const res = await request(app)
      .delete(`/api/groups/${groupId}/leave`)
      .set("Authorization", `Bearer ${tokenC}`);

    expect(res.status).toBe(200);
  });
});
