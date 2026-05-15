import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CreditCard,
  Eye,
  Fingerprint,
  Lock,
  PiggyBank,
  Plus,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { API_URL, cn } from "@/lib/utils";

const portfolioFallback = [
  { m: "Jan", v: 42000 }, { m: "Fev", v: 45200 }, { m: "Mar", v: 44100 },
  { m: "Abr", v: 48900 }, { m: "Mai", v: 52300 }, { m: "Jun", v: 51100 },
  { m: "Jul", v: 56800 }, { m: "Ago", v: 60200 }, { m: "Set", v: 63400 },
  { m: "Out", v: 67900 }, { m: "Nov", v: 71200 }, { m: "Dez", v: 76840 },
];

const allocation = [
  { name: "Renda Fixa", v: 42, color: "hsl(158 84% 50%)" },
  { name: "Ações", v: 28, color: "hsl(180 84% 60%)" },
  { name: "Cripto", v: 14, color: "hsl(38 92% 55%)" },
  { name: "FIIs", v: 10, color: "hsl(280 84% 65%)" },
  { name: "Cash", v: 6, color: "hsl(215 20% 65%)" },
];

const txFallback = [
  { id: "1", t: "Transferência PIX", who: "Maria Silva", v: -240.5, when: "Hoje, 14:32", in: false },
  { id: "2", t: "Rendimento CDB", who: "Banco Nivex", v: 1280.9, when: "Hoje, 09:00", in: true },
  { id: "3", t: "Cartão Premium", who: "Apple Store", v: -899.0, when: "Ontem", in: false },
  { id: "4", t: "Dividendos", who: "ITSA4", v: 312.45, when: "Ontem", in: true },
  { id: "5", t: "Investimento", who: "Tesouro IPCA+", v: -2000.0, when: "23 mai", in: false },
];

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Home() {
  const [portfolio, setPortfolio] = useState(portfolioFallback);
  const [tx, setTx] = useState(txFallback);
  const [amount, setAmount] = useState(5000);
  const [months, setMonths] = useState(24);
  const [rate, setRate] = useState(1.05);
  const [simResult, setSimResult] = useState<{ final: number; profit: number } | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/portfolio`).then(r => r.ok && r.json().then(setPortfolio)).catch(() => {});
    fetch(`${API_URL}/api/transactions`).then(r => r.ok && r.json().then(setTx)).catch(() => {});
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API_URL}/api/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, months, rate }),
      signal: ctrl.signal,
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setSimResult(d))
      .catch(() => {
        const final = amount * Math.pow(1 + rate / 100, months);
        setSimResult({ final, profit: final - amount });
      });
    return () => ctrl.abort();
  }, [amount, months, rate]);

  const indicators = useMemo(
    () => [
      { label: "Patrimônio total", v: fmt(76840.32), d: "+12,4%", up: true, icon: Wallet },
      { label: "Investimentos", v: fmt(54210.0), d: "+8,2%", up: true, icon: TrendingUp },
      { label: "Saldo conta", v: fmt(12430.55), d: "+R$ 1.280", up: true, icon: PiggyBank },
      { label: "Cartão (mês)", v: fmt(3899.77), d: "-4,1%", up: false, icon: CreditCard },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-card grid place-items-center font-display font-bold text-primary-foreground">
              N
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Nivex</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#produto" className="hover:text-foreground">Produto</a>
            <a href="#investir" className="hover:text-foreground">Investir</a>
            <a href="#simulador" className="hover:text-foreground">Simulador</a>
            <a href="#seguranca" className="hover:text-foreground">Segurança</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Entrar</Button>
            <Button size="sm">Abrir conta</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container relative pt-20 pb-32 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground mb-6">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Mais de 2,4M de investidores ativos
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Seu dinheiro,<br />
              <span className="text-gradient">trabalhando 24/7.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Conta digital, cartão premium e investimentos em uma só plataforma.
              Visualize, simule e acompanhe seu patrimônio em tempo real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">
                Abrir conta grátis <ArrowUpRight />
              </Button>
              <Button size="lg" variant="outline">
                <Smartphone /> Baixar app
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Shield className="size-4 text-primary" /> Garantia FGC</span>
              <span className="flex items-center gap-2"><Lock className="size-4 text-primary" /> Criptografia 256-bit</span>
              <span className="flex items-center gap-2"><Zap className="size-4 text-primary" /> PIX gratuito</span>
            </div>
          </motion.div>

          <PhoneMockup />
        </div>
      </section>

      {/* INDICADORES */}
      <section id="produto" className="container -mt-16 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {indicators.map((i, idx) => (
            <motion.div
              key={i.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{i.label}</span>
                <i.icon className="size-4 text-primary" />
              </div>
              <div className="font-display text-2xl font-bold">{i.v}</div>
              <div className={cn("mt-1 text-xs flex items-center gap-1", i.up ? "text-success" : "text-danger")}>
                {i.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {i.d}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="investir" className="container py-24">
        <div className="max-w-2xl mb-12">
          <span className="text-xs text-primary font-mono uppercase tracking-widest">Dashboard</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 tracking-tight">
            Toda sua vida financeira em um lugar
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Portfolio chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Evolução do patrimônio</p>
                <p className="font-display text-3xl font-bold mt-1">{fmt(76840.32)}</p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3" /> +R$ 8.420 nos últimos 30 dias
                </p>
              </div>
              <div className="flex gap-1 text-xs">
                {["1M", "6M", "1A", "Tudo"].map((t, i) => (
                  <button key={t} className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-colors",
                    i === 2 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"
                  )}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolio}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(158 84% 50%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(158 84% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => fmt(v)}
                  />
                  <Area type="monotone" dataKey="v" stroke="hsl(158 84% 50%)" strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation */}
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Alocação da carteira</p>
            <p className="font-display text-2xl font-bold mb-6">5 classes</p>
            <div className="space-y-4">
              {allocation.map(a => (
                <div key={a.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground">{a.name}</span>
                    <span className="font-mono text-muted-foreground">{a.v}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.v}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: a.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-display text-lg font-semibold">Últimas transações</p>
              <button className="text-xs text-primary hover:underline">Ver todas</button>
            </div>
            <div className="divide-y divide-border">
              {tx.map(t => (
                <div key={t.id} className="flex items-center gap-4 py-3.5">
                  <div className={cn(
                    "size-10 rounded-xl grid place-items-center",
                    t.in ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                  )}>
                    {t.in ? <ArrowDownRight className="size-4" /> : <Send className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.t}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.who} · {t.when}</p>
                  </div>
                  <span className={cn("font-mono text-sm font-semibold", t.in ? "text-success" : "text-foreground")}>
                    {t.in ? "+" : ""}{fmt(t.v)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-muted-foreground">Gastos por categoria</p>
            <p className="font-display text-2xl font-bold mt-1 mb-4">{fmt(3899.77)}</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { c: "Alim", v: 1240 }, { c: "Transp", v: 680 },
                  { c: "Lazer", v: 920 }, { c: "Casa", v: 540 }, { c: "Outros", v: 519 },
                ]}>
                  <XAxis dataKey="c" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="v" fill="hsl(158 84% 50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* SIMULADOR */}
      <section id="simulador" className="container py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs text-primary font-mono uppercase tracking-widest">Simulador</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 tracking-tight">
              Veja seu dinheiro<br />render de verdade.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-md">
              Ajuste o valor, o prazo e a taxa. Calculamos em tempo real quanto seu
              investimento pode render no CDB Nivex.
            </p>
          </div>

          <div className="glass rounded-3xl p-8">
            <div className="space-y-6">
              <Slider label="Valor inicial" value={amount} min={500} max={50000} step={500}
                format={fmt} onChange={setAmount} />
              <Slider label="Prazo (meses)" value={months} min={3} max={120} step={1}
                format={v => `${v} meses`} onChange={setMonths} />
              <Slider label="Taxa mensal" value={rate} min={0.3} max={2.5} step={0.05}
                format={v => `${v.toFixed(2)}%`} onChange={setRate} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total final</p>
                <p className="font-display text-2xl font-bold mt-1">
                  {simResult ? fmt(simResult.final) : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-card p-5 text-primary-foreground">
                <p className="text-xs opacity-80 uppercase tracking-wider">Lucro líquido</p>
                <p className="font-display text-2xl font-bold mt-1">
                  {simResult ? fmt(simResult.profit) : "—"}
                </p>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg">
              <Sparkles /> Investir agora
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="seguranca" className="container py-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { i: Fingerprint, t: "Login biométrico", d: "FaceID, TouchID e autenticação multifator em todas as operações." },
            { i: Shield, t: "Garantia FGC", d: "Investimentos protegidos pelo Fundo Garantidor de Créditos até R$ 250 mil." },
            { i: Zap, t: "PIX em 3 segundos", d: "Transferências instantâneas, gratuitas e ilimitadas, 24 horas por dia." },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-7"
            >
              <div className="size-12 rounded-xl bg-primary/15 grid place-items-center text-primary mb-5">
                <f.i className="size-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl glass p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Pronto para investir <span className="text-gradient">como um pro?</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Abra sua conta em 3 minutos. Sem taxa de manutenção. Sem letras miúdas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg">Abrir conta grátis <ArrowUpRight /></Button>
              <Button size="lg" variant="outline">Falar com especialista</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-gradient-card grid place-items-center font-display font-bold text-primary-foreground text-sm">N</div>
            <span>© 2026 Nivex Financeira S.A.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Termos</a>
            <a href="#" className="hover:text-foreground">Privacidade</a>
            <a href="#" className="hover:text-foreground">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Slider({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-sm font-semibold text-primary">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-grab"
        style={{ background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--secondary)) ${pct}%)` }}
      />
    </div>
  );
}

function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto"
    >
      <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full" />
      <div className="relative w-[300px] h-[600px] mx-auto rounded-[3rem] bg-gradient-to-b from-secondary to-card border border-border p-3 shadow-card animate-float">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-full z-10" />
        <div className="w-full h-full rounded-[2.4rem] bg-background overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 pt-8 pb-4 text-xs">
            <span className="font-mono">9:41</span>
            <div className="flex gap-1.5"><span className="size-1.5 rounded-full bg-foreground" /><span className="size-1.5 rounded-full bg-foreground" /><span className="size-1.5 rounded-full bg-foreground" /></div>
          </div>
          <div className="px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Olá, Lucas</p>
                <p className="font-display font-semibold">Bom dia ☀</p>
              </div>
              <Bell className="size-5 text-muted-foreground" />
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-card p-5 text-primary-foreground relative overflow-hidden">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
              <p className="text-xs opacity-80 flex items-center gap-1.5"><Eye className="size-3" /> Saldo total</p>
              <p className="font-display text-2xl font-bold mt-1">R$ 76.840,32</p>
              <p className="text-xs opacity-80 mt-1">+R$ 1.280 hoje</p>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[{ i: Send, l: "PIX" }, { i: Plus, l: "Depositar" }, { i: TrendingUp, l: "Investir" }, { i: CreditCard, l: "Cartão" }].map(a => (
                <div key={a.l} className="flex flex-col items-center gap-1.5">
                  <div className="size-11 rounded-xl bg-secondary grid place-items-center text-primary">
                    <a.i className="size-4" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{a.l}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted-foreground mb-2">Atividade</p>
            <div className="space-y-2">
              {txFallback.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-2.5">
                  <div className={cn("size-8 rounded-lg grid place-items-center",
                    t.in ? "bg-primary/15 text-primary" : "bg-card text-foreground")}>
                    {t.in ? <ArrowDownRight className="size-3.5" /> : <Send className="size-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{t.t}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{t.who}</p>
                  </div>
                  <span className={cn("text-xs font-mono font-semibold", t.in ? "text-success" : "text-foreground")}>
                    {t.in ? "+" : ""}{fmt(t.v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
