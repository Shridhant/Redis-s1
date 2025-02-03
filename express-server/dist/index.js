"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Create and connect Redis client
const client = (0, redis_1.createClient)();
client.on("error", (err) => console.error("Redis error:", err));
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connected to Redis");
        }
        catch (error) {
            console.error("Error connecting to Redis:", error);
            process.exit(1); // Exit process if Redis connection fails
        }
    });
}
// API Routes
app.get("/", (req, res) => {
    console.log("GET / request received");
    res.send("Hello World!");
});
app.post("/api", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, body } = req.body;
    try {
        yield client.lPush("posts", JSON.stringify({ id, title, body }));
        res.status(201).send("Post created");
    }
    catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Error creating post");
    }
}));
// Start Server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectRedis(); // Ensure Redis is connected before starting the server
        app.listen(3001, () => {
            console.log("Server is running on port 3000");
        });
    });
}
startServer();
