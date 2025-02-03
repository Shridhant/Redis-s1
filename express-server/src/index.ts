import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

// Create and connect Redis client
const client = createClient();
client.on("error", (err) => console.error("Redis error:", err));

async function connectRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    process.exit(1); // Exit process if Redis connection fails
  }
}

// API Routes
app.get("/", (req, res) => {
  console.log("GET / request received");
  res.send("Hello World!");
});

app.post("/api", async (req, res) => {
  const { id, title, body } = req.body;

  try {
    await client.lPush("posts", JSON.stringify({ id, title, body }));
    res.status(201).send("Post created");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
});

// Start Server
async function startServer() {
  await connectRedis(); // Ensure Redis is connected before starting the server

  app.listen(3001, () => {
    console.log("Server is running on port 3000");
  });
}

startServer();
