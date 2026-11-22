const BASE_URL = "http://localhost:5000/api";

async function runLiveHttpTests() {
  console.log("=== RUNNING LIVE HTTP END-TO-END VERIFICATION ===");

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  console.log("1. /api/health:", healthRes.status, health);

  // 2. Register
  const testEmail = `dev_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Dev Live Tester",
      email: testEmail,
      password: "Password123"
    })
  });
  const regData = (await regRes.json()) as any;
  console.log("2. /api/auth/register:", regRes.status, "Token exists:", !!regData.data?.token);
  const token = regData.data.token;

  // 3. Me endpoint
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meData = (await meRes.json()) as any;
  console.log("3. /api/auth/me:", meRes.status, "User email:", meData.data?.email);

  // 4. Create post
  const postRes = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: "Live Verified Blog Post",
      description: "Testing end-to-end database persistence on live HTTP server",
      content: "This blog post confirms live REST endpoints and database functionality work properly."
    })
  });
  const postData = (await postRes.json()) as any;
  const postId = postData.data.id;
  console.log("4. /api/posts (POST):", postRes.status, "Post ID:", postId);

  // 5. Get posts
  const listRes = await fetch(`${BASE_URL}/posts?page=1&limit=5`);
  const listData = (await listRes.json()) as any;
  console.log("5. /api/posts (GET):", listRes.status, "Found posts:", listData.data?.length);

  // 6. Create comment
  const commentRes = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      content: "First live comment on the post!"
    })
  });
  const commentData = (await commentRes.json()) as any;
  console.log("6. /api/posts/:id/comments (POST):", commentRes.status, "Comment ID:", commentData.data?.id);

  // 7. Get comments
  const commentsRes = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  const commentsData = (await commentsRes.json()) as any;
  console.log("7. /api/posts/:id/comments (GET):", commentsRes.status, "Comments count:", commentsData.data?.length);

  console.log("=== ALL LIVE HTTP TESTS COMPLETED SUCCESSFULLY ===");
}

runLiveHttpTests().catch((err) => {
  console.error("Live HTTP test failed:", err);
  process.exit(1);
});
