import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectRedis, redis } from "./libs/redis.js";
import searchRouter from "./routes/search.route.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());

app.use(express.json());

app.use("/api", searchRouter);

app.get("/", (req, res) => {
  res.json({
    server: process.env.HOSTNAME,
    pid: process.pid,
    time: new Date().toISOString(),
  });
});

app.use("/api/search", searchRouter);

async function bootstrap() {
  try {
    await connectRedis();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    const shutdown = (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      server.close(async (err) => {
        if (err) {
          console.error("Error during server shutdown:", err);
          process.exit(1);
        }

        try {
          await redis.quit();
          console.log("Redis connection closed.");
          console.log("Shutdown complete. Exiting.");
          process.exit(0);
        } catch (error) {
          console.error("Error closing Redis:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
bootstrap();
