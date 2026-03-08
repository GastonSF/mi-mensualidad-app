"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppState } from "@/hooks/use-app-state"
import { getKidTotalSpent, getKidRemaining, getExpensesByCategory, getKidExpenses } from "@/lib/store"
import type { KidProfile } from "@/lib/types"
import { Wallet, ShoppingCart, PiggyBank, Star } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface ParentDashboardProps {
  kid: KidProfile
}

const CATEGORY_LABELS: Record<string, string> = {
  food: "Comida",
  games: "Juegos",
  transport: "Transporte",
  school: "Escuela",
  other: "Otro",
}

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

export function ParentDashboard({ kid }: ParentDashboardProps) {
  const { state } = useAppState()
  const spent = getKidTotalSpent(state, kid.id)
  const remaining = getKidRemaining(state, kid.id)
  const byCategory = getExpensesByCategory(state, kid.id).map((d) => ({
    ...d,
    label: CATEGORY_LABELS[d.category] || d.category,
  }))

  const expenses = getKidExpenses(state, kid.id)
  const byDate: Record<string, number> = {}
  for (const e of expenses) {
    byDate[e.date] = (byDate[e.date] || 0) + e.amount
  }
  const timeData = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date: date.slice(5), amount }))

  const formatMoney = (val: number) => `$${val.toLocaleString("es-CO")}`

  return (
<>

  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
        Panel de {kid.name}
      </h2>

      <div className="rounded-xl border border-border bg-card p-4 mb-4">
      <h3 className="text-base font-bold text-foreground">Gestionar hijos</h3>
  </div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground">Mensualidad</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatMoney(kid.monthlyAllowance)}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-destructive" />
              <span className="text-[10px] font-medium text-muted-foreground">Gastado</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatMoney(spent)}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-success" />
              <span className="text-[10px] font-medium text-muted-foreground">Disponible</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatMoney(remaining)}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">Puntos</span>
            </div>
            <p className="text-lg font-bold text-foreground">{kid.pointsBalance}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Spending by category */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Gastos por categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {byCategory.length > 0 ? (
              <div className="flex flex-col items-center gap-3">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={byCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      dataKey="amount"
                      nameKey="label"
                      strokeWidth={2}
                      stroke="var(--color-card)"
                    >
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatMoney(value)}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        color: "var(--color-foreground)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3">
                  {byCategory.map((d, i) => (
                    <div key={d.category} className="flex items-center gap-1.5">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">Sin datos</p>
            )}
          </CardContent>
        </Card>

        {/* Spending over time */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Gastos por dia
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatMoney(value)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
      </div>
  </>
)
}
