import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

// Set environment for test
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/blogdb_test?schema=public";
process.env.JWT_SECRET = "test-jwt-secret-key-1234567890";
process.env.PORT = "5001";
process.env.NODE_ENV = "test";

const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/blogdb_test?schema=public"
    }
  }
});

// Import app after env is configured
import app from "../src/app.js";

describe("Blog Platform REST API Integration Tests", () => {
  let user1Token: string;
  let user1Id: string;
  let user2Token: string;
  let user2Id: string;
  let testPostId: string;
  let testCommentId: string;

  beforeAll(async () => {
    // Clean test database tables
    await testPrisma.comment.deleteMany();
    await testPrisma.post.deleteMany();
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.comment.deleteMany();
    await testPrisma.post.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.$disconnect();
  });

  // 1. User registration
  it("1. should register a new user successfully (POST /api/auth/register)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alice Engineer",
        email: "alice@example.com",
        password: "Password123"
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe("alice@example.com");
    expect(res.body.data.user.password).toBeUndefined(); // Never expose password
    expect(res.body.data.token).toBeDefined();

    user1Token = res.body.data.token;
    user1Id = res.body.data.user.id;
  });

  // 2. Duplicate email registration
  it("2. should reject duplicate email registration with 409 Conflict", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alice Imposter",
        email: "alice@example.com",
        password: "Password123"
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already exists");
  });

  // 3. Login with valid credentials
  it("3. should log in successfully with valid credentials (POST /api/auth/login)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@example.com",
        password: "Password123"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  // 4. Login with incorrect credentials
  it("4. should reject login with incorrect password with 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@example.com",
        password: "WrongPassword999"
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 5. Access protected endpoints without authentication
  it("5. should reject access to /api/auth/me without token (401)", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("5b. should allow access to /api/auth/me with valid Bearer token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("alice@example.com");
  });

  // Setup second user for ownership authorization tests
  it("should register a second user (Bob)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Bob Designer",
        email: "bob@example.com",
        password: "Password123"
      });

    expect(res.status).toBe(201);
    user2Token = res.body.data.token;
    user2Id = res.body.data.user.id;
  });

  // 6. Create a post
  it("6. should allow authenticated user to create a post (POST /api/posts)", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        title: "Building Modern Web Applications",
        description: "An in-depth guide to modern architecture with React and Express",
        content: "Detailed editorial content about full-stack engineering principles and scalable systems."
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Building Modern Web Applications");
    expect(res.body.data.author.id).toBe(user1Id);
    testPostId = res.body.data.id;
  });

  // 7. Retrieve posts
  it("7. should retrieve paginated posts with author info (GET /api/posts)", async () => {
    const res = await request(app).get("/api/posts?page=1&limit=10");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].author.name).toBe("Alice Engineer");
  });

  it("7b. should filter posts by search query (GET /api/posts?search=...)", async () => {
    const res = await request(app).get("/api/posts?search=Modern");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);

    const emptyRes = await request(app).get("/api/posts?search=NonExistentKeywordXYZ");
    expect(emptyRes.status).toBe(200);
    expect(emptyRes.body.data.length).toBe(0);
  });

  it("7c. should retrieve single post details (GET /api/posts/:id)", async () => {
    const res = await request(app).get(`/api/posts/${testPostId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testPostId);
    expect(res.body.data.author).toBeDefined();
  });

  // 8. Update own post
  it("8. should allow author to update their own post (PUT /api/posts/:id)", async () => {
    const res = await request(app)
      .put(`/api/posts/${testPostId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        title: "Building Modern Web Applications (Updated)",
        description: "Updated description with latest revisions"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Building Modern Web Applications (Updated)");
  });

  // 9. Attempt to update another user's post
  it("9. should forbid non-owner from updating post (403 Forbidden)", async () => {
    const res = await request(app)
      .put(`/api/posts/${testPostId}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        title: "Hacked Title Attempt"
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // 11. Add comments
  it("11. should allow authenticated user to add a comment (POST /api/posts/:id/comments)", async () => {
    const res = await request(app)
      .post(`/api/posts/${testPostId}/comments`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        content: "Exceptional article, learned a lot about system design!"
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Exceptional article, learned a lot about system design!");
    expect(res.body.data.author.id).toBe(user2Id);
    testCommentId = res.body.data.id;
  });

  // 12. Retrieve comments
  it("12. should retrieve all comments for a post (GET /api/posts/:id/comments)", async () => {
    const res = await request(app).get(`/api/posts/${testPostId}/comments`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].author.name).toBe("Bob Designer");
  });

  // 14. Attempt to delete another user's comment
  it("14. should forbid user from deleting someone else's comment (403)", async () => {
    const res = await request(app)
      .delete(`/api/comments/${testCommentId}`)
      .set("Authorization", `Bearer ${user1Token}`); // Alice tries to delete Bob's comment

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // 13. Delete own comment
  it("13. should allow author to delete their own comment (DELETE /api/comments/:id)", async () => {
    const res = await request(app)
      .delete(`/api/comments/${testCommentId}`)
      .set("Authorization", `Bearer ${user2Token}`); // Bob deletes his comment

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify comment is removed
    const verifyRes = await request(app).get(`/api/posts/${testPostId}/comments`);
    expect(verifyRes.body.data.length).toBe(0);
  });

  // 10. Delete own post (and test cascade)
  it("10a. should forbid non-owner from deleting post (403 Forbidden)", async () => {
    const res = await request(app)
      .delete(`/api/posts/${testPostId}`)
      .set("Authorization", `Bearer ${user2Token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("10b. should allow author to delete their own post (DELETE /api/posts/:id)", async () => {
    const res = await request(app)
      .delete(`/api/posts/${testPostId}`)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify post is gone
    const verifyRes = await request(app).get(`/api/posts/${testPostId}`);
    expect(verifyRes.status).toBe(404);
  });

  // 15. Invalid input handling
  it("15. should validate input schema and reject invalid payloads (400 Bad Request)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "A", // too short
        email: "not-an-email",
        password: "weak"
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});
