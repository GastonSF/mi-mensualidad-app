"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { RuleCategory, RuleFrequency } from "@/lib/types"
import { Plus, Star, Gift, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const frequencyLabels: Record<RuleFrequency, string> = {
  "one-time": "Una vez",
  daily: "Diario",
  weekly: "Semanal",
}

export function ParentRules() {
  const { state, addRule } = useAppState()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [points, setPoints] = useState("")
  const [moneyValue, setMoneyValue] = useState("")
  const [category, setCategory] = useState<RuleCategory>("reward")
  const [frequency, setFrequency] = useState<RuleFrequency>("one-time")
  const [ruleType, setRuleType] = useState<"task" | "reward">("task")

  function handleSubmit() {
    if (!title.trim()) {
      toast.error("Ingresa un titulo")
      return
    }
    const parsedPoints = Number(points)
    if (!parsedPoints || parsedPoints <= 0) {
      toast.error("Ingresa puntos validos")
      return
    }
    addRule({
      title: title.trim(),
      points: category === "penalty" ? -parsedPoints : parsedPoints,
      moneyValue: moneyValue ? Number(moneyValue) : undefined,
      category,
      frequency,
      type: ruleType,
    })
    toast.success("Regla creada")
    setTitle("")
    setPoints("")
    setMoneyValue("")
    setCategory("reward")
    setFrequency("one-time")
    setRuleType("task")
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Reglas
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Nueva regla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "var(--font-heading)" }}>Nueva regla</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rule-title">Titulo</Label>
                <Input
                  id="rule-title"
                  placeholder="Ej: Sacar al perro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Tipo</Label>
                <Select value={ruleType} onValueChange={(v) => setRuleType(v as "task" | "reward")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Tarea (gana puntos)</SelectItem>
                    <SelectItem value="reward">Premio (canjea puntos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rule-points">Puntos</Label>
                <Input
                  id="rule-points"
                  type="number"
                  placeholder="0"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rule-money">Valor en dinero (opcional)</Label>
                <Input
                  id="rule-money"
                  type="number"
                  placeholder="0"
                  value={moneyValue}
                  onChange={(e) => setMoneyValue(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as RuleCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reward">Positivo</SelectItem>
                    <SelectItem value="penalty">Penalizacion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Frecuencia</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as RuleFrequency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">Una vez</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} className="w-full">
                Crear regla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        {state.rules.map((rule) => (
          <Card key={rule.id} className="border-border">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                rule.type === "task" ? "bg-success/10" : "bg-accent/10"
              }`}>
                {rule.type === "task" ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Gift className="h-5 w-5 text-accent-foreground" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{rule.title}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {rule.type === "task" ? "Tarea" : "Premio"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {frequencyLabels[rule.frequency]}
                  </Badge>
                  {rule.moneyValue && (
                    <span className="text-[10px] text-muted-foreground">${rule.moneyValue.toLocaleString("es-CO")}</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Star className="h-3.5 w-3.5 text-accent-foreground" />
                <span className={`text-sm font-bold ${rule.points >= 0 ? "text-success" : "text-destructive"}`}>
                  {rule.points > 0 ? "+" : ""}{rule.points}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
