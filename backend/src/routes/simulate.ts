import { Router } from "express";
import { z } from "zod";

export const simulateRouter = Router();

const schema = z.object({
  amount: z.number().positive().max(10_000_000),
  months: z.number().int().min(1).max(600),
  rate: z.number().min(0).max(10), // % ao mês
});

simulateRouter.post("/", (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount, months, rate } = parsed.data;
  const final = amount * Math.pow(1 + rate / 100, months);
  const profit = final - amount;
  res.json({
    final: Number(final.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    inputs: { amount, months, rate },
  });
});
