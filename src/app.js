import { config } from "dotenv";
import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import { connectDB } from "./config/db.js";
import router from "./routes/index.js";

config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(express.json());

app.use("/api", router);

app.use("/health", (req, res) => {
  console.log("Server is healthy");
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use(errorMiddleware);

export default app;
