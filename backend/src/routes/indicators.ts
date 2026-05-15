import { Router } from "express";
import { prisma } from "../lib/prisma";

export const indicatorsRouter = Router();

indicatorsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.indicator.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length) return res.json(rows);
    res.json([
      { label: "Patrimônio total", value: 76840.32, delta: "+12,4%", up: true },
      { label: "Investimentos", value: 54210.0, delta: "+8,2%", up: true },
      { label: "Saldo conta", value: 12430.55, delta: "+R$ 1.280", up: true },
      { label: "Cartão (mês)", value: 3899.77, delta: "-4,1%", up: false },
    ]);
  } catch (e) { next(e); }
});
