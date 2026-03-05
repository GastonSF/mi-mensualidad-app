"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppState } from "@/hooks/use-app-state"
import { getKidTotalSpent, getKidRemaining } from "@/lib/store"
import type { KidProfile } from "@/lib/types"
import { Wallet, ShoppingCart, PiggyBank, Star } from "lucide-react"

interface KidDashboardProps {
  kid: KidProfile
}

export function KidDashboard({ kid }: KidDashboardProps) {
  const { state } = useAppState()
  const spent = getKidTotalSpent(state, kid.id)
  const remaining = getKidRemaining(state, kid.id)
  const percentUsed = kid.monthlyAllowance > 0 ? Math.min(100, (spent / kid.monthlyAllowance) * 100) : 0

  const formatMoney = (amount: number) => {
    return `$${amount.toLocaleString("es-CO")}`
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
        Resumen del mes
      </h2>

      {/* Main allowance card */}
      <Card className="border-0 bg-primary text-primary-foreground shadow-lg">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-90">Mensualidad</span>
            <Wallet className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-3xl font-extrabold tracking-tight">
            {formatMoney(kid.monthlyAllowance)}
          </p>
          <Progress
            value={percentUsed}
            className="h-2 bg-primary-foreground/20"
          />
          <p className="text-xs opacity-80">
            {percentUsed.toFixed(0)}% utilizado este mes
          </p>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border">
          <CardContent className="flex flex-col items-center gap-1.5 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
              <ShoppingCart className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Gastado</p>
            <p className="text-sm font-bold text-foreground">{formatMoney(spent)}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex flex-col items-center gap-1.5 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10">
              <PiggyBank className="h-4 w-4 text-success" />
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Disponible</p>
            <p className="text-sm font-bold text-foreground">{formatMoney(remaining)}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex flex-col items-center gap-1.5 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
              <Star className="h-4 w-4 text-accent-foreground" />
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">Puntos</p>
            <p className="text-sm font-bold text-foreground">{kid.pointsBalance}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-foreground">Actividad reciente</h3>
        {state.expenses
          .filter((e) => e.kidId === kid.id)
          .slice(-5)
          .reverse()
          .map((expense) => (
            <Card key={expense.id} className="border-border">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">{expense.note || expense.category}</p>
                  <p className="text-xs text-muted-foreground capitalize">{expense.category}</p>
                </div>
                <p className="text-sm font-bold text-destructive">-{formatMoney(expense.amount)}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
