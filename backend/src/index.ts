import "dotenv/config";
import express from "express";
import cors from "cors";
import { indicatorsRouter } from "./routes/indicators";
import { portfolioRouter } from "./routes/portfolio";
import { transactionsRouter } from "./routes/transactions";
import { simulateRouter } from "./routes/simulate";

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use("/api/indicators", indicatorsRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/simulate", simulateRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
