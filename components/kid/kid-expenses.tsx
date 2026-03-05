"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppState } from "@/hooks/use-app-state"
import { getKidExpenses } from "@/lib/store"
import type { KidProfile, ExpenseCategory } from "@/lib/types"
import { Plus, Utensils, Gamepad2, Bus, GraduationCap, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

const categoryConfig: Record<ExpenseCategory, { label: string; icon: React.ReactNode; color: string }> = {
  food: { label: "Comida", icon: <Utensils className="h-3.5 w-3.5" />, color: "bg-chart-2/10 text-chart-2" },
  games: { label: "Juegos", icon: <Gamepad2 className="h-3.5 w-3.5" />, color: "bg-chart-1/10 text-chart-1" },
  transport: { label: "Transporte", icon: <Bus className="h-3.5 w-3.5" />, color: "bg-chart-3/10 text-chart-3" },
  school: { label: "Escuela", icon: <GraduationCap className="h-3.5 w-3.5" />, color: "bg-chart-4/10 text-chart-4" },
  other: { label: "Otro", icon: <MoreHorizontal className="h-3.5 w-3.5" />, color: "bg-muted text-muted-foreground" },
}

interface KidExpensesProps {
  kid: KidProfile
}

export function KidExpenses({ kid }: KidExpensesProps) {
  const { state, addExpense } = useAppState()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<ExpenseCategory>("food")
  const [note, setNote] = useState("")

  const expenses = getKidExpenses(state, kid.id).reverse()

  const formatMoney = (val: number) => `$${val.toLocaleString("es-CO")}`

  function handleSubmit() {
    const parsed = Number(amount)
    if (!parsed || parsed <= 0) {
      toast.error("Ingresa un monto valido")
      return
    }
    addExpense({
      kidId: kid.id,
      amount: parsed,
      category,
      note,
      date: new Date().toISOString().slice(0, 10),
    })
    toast.success("Gasto registrado")
    setAmount("")
    setNote("")
    setCategory("food")
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Mis Gastos
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Registrar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "var(--font-heading)" }}>Registrar gasto</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, conf]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          {conf.icon} {conf.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="note">Nota (opcional)</Label>
                <Textarea
                  id="note"
                  placeholder="Que compraste?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} className="w-full">
                Guardar gasto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {expenses.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-muted-foreground">No tienes gastos registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {expenses.map((expense) => {
            const config = categoryConfig[expense.category]
            return (
              <Card key={expense.id} className="border-border">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {expense.note || config.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {config.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{expense.date}</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-destructive">
                    -{formatMoney(expense.amount)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
