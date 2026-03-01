import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { attachNotion } from "./middleware/auth";
import notionRoutes from "./routes/notion";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
  })
);
app.use(express.json());
app.use("/api", attachNotion, notionRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
