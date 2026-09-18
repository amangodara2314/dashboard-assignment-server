import app from "./app.js";
import { disconnectDB } from "./config/db.js";
const PORT = process.env.PORT;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });
};

process.on("uncaughtException", async (err) => {
  await disconnectDB();
  console.log("uncaughtException Error :", err);
  process.exit(1);
});

process.on("unhandledRejection", async (err) => {
  await disconnectDB();
  console.log("unhandledRejection Error :", err);
  process.exit(1);
});

// handle graceful shutdown
process.on("SIGINT", async (err) => {
  await disconnectDB();
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGTERM", async (err) => {
  await disconnectDB();
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

startServer();
