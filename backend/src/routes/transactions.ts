import { Router } from "express";
import { prisma } from "../lib/prisma";

export const transactionsRouter = Router();

const fallback = [
  { id: "1", t: "Transferência PIX", who: "Maria Silva", v: -240.5, when: "Hoje, 14:32", in: false },
  { id: "2", t: "Rendimento CDB", who: "Banco Nivex", v: 1280.9, when: "Hoje, 09:00", in: true },
  { id: "3", t: "Cartão Premium", who: "Apple Store", v: -899.0, when: "Ontem", in: false },
  { id: "4", t: "Dividendos", who: "ITSA4", v: 312.45, when: "Ontem", in: true },
  { id: "5", t: "Investimento", who: "Tesouro IPCA+", v: -2000.0, when: "23 mai", in: false },
];

transactionsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.transaction.findMany({ orderBy: { occurredAt: "desc" }, take: 8 });
    if (rows.length) {
      return res.json(rows.map(r => ({
        id: r.id, t: r.title, who: r.party, v: r.amount, in: r.inflow,
        when: r.occurredAt.toLocaleDateString("pt-BR"),
      })));
    }
    res.json(fallback);
  } catch (e) { next(e); }
});
