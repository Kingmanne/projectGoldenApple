// smoke-test.js
require("dotenv").config();
const http = require("http");

const PORT = process.env.PORT || 3000;
const HOST = "localhost";

console.log("🔥 Running smoke tests...");
console.log(`Testing server at http://${HOST}:${PORT}`);

// Start the server
const app = require("./server");
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server started on port ${PORT}`);

  // Wait for server to be truly ready
  waitForServer(runTests);
});

function waitForServer(callback, maxRetries = 10, retryDelay = 500) {
  let attempts = 0;

  function attempt() {
    attempts++;

    const request = http
      .get(`http://${HOST}:${PORT}/`, (res) => {
        // Server is ready, drain the response
        res.on("data", () => {});
        res.on("end", callback);
      })
      .on("error", () => {
        if (attempts < maxRetries) {
          console.log(
            `⏳ Waiting for server... attempt ${attempts}/${maxRetries}`,
          );
          setTimeout(attempt, retryDelay);
        } else {
          console.log("❌ Server failed to start after retries");
          cleanup(1);
        }
      });

    request.setTimeout(1000, () => {
      request.destroy();
      if (attempts < maxRetries) {
        setTimeout(attempt, retryDelay);
      }
    });
  }

  attempt();
}

function runTests() {
  // Test 1: Check if server responds
  console.log("\n📝 Test 1: Checking if server responds...");

  http
    .get(`http://${HOST}:${PORT}/`, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Test 1 PASSED: Server is responding");

        // Test 2: Check response content
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log("\n📝 Test 2: Checking response content...");
          if (data.includes("html")) {
            console.log("✅ Test 2 PASSED: Server returns HTML content");
            console.log("\n🎉 All smoke tests passed!");
            cleanup(0);
          } else {
            console.log("❌ Test 2 FAILED: Expected HTML content");
            cleanup(1);
          }
        });
      } else {
        console.log(
          `❌ Test 1 FAILED: Expected status 200, got ${res.statusCode}`,
        );
        cleanup(1);
      }
    })
    .on("error", (err) => {
      console.log("❌ Test 1 FAILED: Could not connect to server");
      console.log("Error:", err.message);
      cleanup(1);
    });
}

function cleanup(exitCode) {
  console.log("\n🧹 Cleaning up...");
  server.close(() => {
    console.log("Server stopped");
    process.exit(exitCode);
  });
}
