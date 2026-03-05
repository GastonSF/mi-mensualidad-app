import type { AppState, KidProfile, Expense, Reward, Task, Rule, Claim } from "./types"

const STORAGE_KEY = "mi-mensualidad-data"

const defaultRewards: Reward[] = [
  { id: "r1", title: "+30 minutos de pantalla", pointsCost: 30, rewardType: "item" },
  { id: "r2", title: "$1000 extra", pointsCost: 50, rewardType: "money", moneyValue: 1000 },
  { id: "r3", title: "Elegir la pelicula del viernes", pointsCost: 40, rewardType: "item" },
]

const defaultTasks: Task[] = [
  { id: "t1", title: "Terminar un libro", points: 50 },
  { id: "t2", title: "Ordenar habitacion", points: 10 },
  { id: "t3", title: "Hacer ejercicio", points: 20 },
]

const defaultKids: KidProfile[] = [
  { id: "kid1", name: "Sofia", age: 12, monthlyAllowance: 5000, pointsBalance: 120 },
  { id: "kid2", name: "Mateo", age: 15, monthlyAllowance: 8000, pointsBalance: 75 },
]

const defaultExpenses: Expense[] = [
  { id: "e1", kidId: "kid1", amount: 800, category: "food", note: "Almuerzo con amigos", date: "2026-03-01" },
  { id: "e2", kidId: "kid1", amount: 1200, category: "games", note: "Juego nuevo", date: "2026-03-02" },
  { id: "e3", kidId: "kid1", amount: 500, category: "transport", note: "Uber al cine", date: "2026-03-03" },
  { id: "e4", kidId: "kid2", amount: 1500, category: "food", note: "Pizza con el equipo", date: "2026-03-01" },
  { id: "e5", kidId: "kid2", amount: 2000, category: "school", note: "Materiales de proyecto", date: "2026-03-02" },
]

const defaultRules: Rule[] = [
  { id: "rule1", title: "Terminar un libro", points: 50, category: "reward", frequency: "one-time", type: "task" },
  { id: "rule2", title: "Ordenar habitacion", points: 10, category: "reward", frequency: "daily", type: "task" },
  { id: "rule3", title: "Hacer ejercicio", points: 20, category: "reward", frequency: "daily", type: "task" },
  { id: "rule4", title: "+30 minutos de pantalla", points: 30, category: "reward", frequency: "one-time", type: "reward" },
  { id: "rule5", title: "$1000 extra", points: 50, moneyValue: 1000, category: "reward", frequency: "weekly", type: "reward" },
]

const defaultClaims: Claim[] = [
  { id: "c1", kidId: "kid1", type: "task", refId: "t1", refTitle: "Terminar un libro", points: 50, status: "pending", date: "2026-03-04" },
  { id: "c2", kidId: "kid2", type: "reward", refId: "r1", refTitle: "+30 minutos de pantalla", points: 30, status: "pending", date: "2026-03-04" },
]

const defaultState: AppState = {
  currentRole: null,
  currentKidId: null,
  kids: defaultKids,
  expenses: defaultExpenses,
  rewards: defaultRewards,
  tasks: defaultTasks,
  rules: defaultRules,
  claims: defaultClaims,
}

export function getState(): AppState {
  if (typeof window === "undefined") return defaultState
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AppState
    }
  } catch {
    // ignore
  }
  saveState(defaultState)
  return defaultState
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): AppState {
  saveState(defaultState)
  return defaultState
}

// Computed helpers
export function getKidExpenses(state: AppState, kidId: string): Expense[] {
  return state.expenses.filter((e) => e.kidId === kidId)
}

export function getKidTotalSpent(state: AppState, kidId: string): number {
  return getKidExpenses(state, kidId).reduce((sum, e) => sum + e.amount, 0)
}

export function getKidRemaining(state: AppState, kidId: string): number {
  const kid = state.kids.find((k) => k.id === kidId)
  if (!kid) return 0
  return kid.monthlyAllowance - getKidTotalSpent(state, kidId)
}

export function getKidClaims(state: AppState, kidId: string): Claim[] {
  return state.claims.filter((c) => c.kidId === kidId)
}

export function getPendingClaims(state: AppState): Claim[] {
  return state.claims.filter((c) => c.status === "pending")
}

export function getExpensesByCategory(state: AppState, kidId: string) {
  const expenses = getKidExpenses(state, kidId)
  const grouped: Record<string, number> = {}
  for (const e of expenses) {
    grouped[e.category] = (grouped[e.category] || 0) + e.amount
  }
  return Object.entries(grouped).map(([category, amount]) => ({ category, amount }))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
