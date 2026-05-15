import { Router } from "express";
import { prisma } from "../lib/prisma";

export const portfolioRouter = Router();

const fallback = [
  { m: "Jan", v: 42000 }, { m: "Fev", v: 45200 }, { m: "Mar", v: 44100 },
  { m: "Abr", v: 48900 }, { m: "Mai", v: 52300 }, { m: "Jun", v: 51100 },
  { m: "Jul", v: 56800 }, { m: "Ago", v: 60200 }, { m: "Set", v: 63400 },
  { m: "Out", v: 67900 }, { m: "Nov", v: 71200 }, { m: "Dez", v: 76840 },
];

portfolioRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.portfolioPoint.findMany({ orderBy: { order: "asc" } });
    if (rows.length) return res.json(rows.map(r => ({ m: r.month, v: r.value })));
    res.json(fallback);
  } catch (e) { next(e); }
});
