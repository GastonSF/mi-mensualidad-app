"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { AppState, Expense, Claim, Reward, Task, Rule, KidProfile } from "@/lib/types"
import { getState, saveState, generateId, resetState } from "@/lib/store"

let currentState: AppState = getState()
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentState
}

function getServerSnapshot() {
  return currentState
}

function setState(updater: (prev: AppState) => AppState) {
  currentState = updater(currentState)
  saveState(currentState)
  notify()
}

export function useAppState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setRole = useCallback((role: AppState["currentRole"]) => {
    setState((prev) => ({ ...prev, currentRole: role }))
  }, [])

  const setCurrentKid = useCallback((kidId: string | null) => {
    setState((prev) => ({ ...prev, currentKidId: kidId }))
  }, [])

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: generateId() }],
    }))
  }, [])

  const addClaim = useCallback((claim: Omit<Claim, "id" | "status" | "date">) => {
    setState((prev) => ({
      ...prev,
      claims: [
        ...prev.claims,
        { ...claim, id: generateId(), status: "pending", date: new Date().toISOString().slice(0, 10) },
      ],
    }))
  }, [])

  const approveClaim = useCallback((claimId: string) => {
    setState((prev) => {
      const claim = prev.claims.find((c) => c.id === claimId)
      if (!claim) return prev
      const updatedClaims = prev.claims.map((c) => (c.id === claimId ? { ...c, status: "approved" as const } : c))
      const updatedKids = prev.kids.map((k) =>
        k.id === claim.kidId ? { ...k, pointsBalance: k.pointsBalance + (claim.type === "task" ? claim.points : -claim.points) } : k
      )
      return { ...prev, claims: updatedClaims, kids: updatedKids }
    })
  }, [])

  const rejectClaim = useCallback((claimId: string) => {
    setState((prev) => ({
      ...prev,
      claims: prev.claims.map((c) => (c.id === claimId ? { ...c, status: "rejected" as const } : c)),
    }))
  }, [])

  const addReward = useCallback((reward: Omit<Reward, "id">) => {
    setState((prev) => ({
      ...prev,
      rewards: [...prev.rewards, { ...reward, id: generateId() }],
    }))
  }, [])

  const addTask = useCallback((task: Omit<Task, "id">) => {
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: generateId() }],
    }))
  }, [])

  const addRule = useCallback((rule: Omit<Rule, "id">) => {
    setState((prev) => {
      const newRule = { ...rule, id: generateId() }
      const newState = { ...prev, rules: [...prev.rules, newRule] }
      if (rule.type === "task") {
        newState.tasks = [...prev.tasks, { id: newRule.id, title: rule.title, points: rule.points }]
      } else if (rule.type === "reward") {
        newState.rewards = [
          ...prev.rewards,
          { id: newRule.id, title: rule.title, pointsCost: rule.points, rewardType: rule.moneyValue ? "money" : "item", moneyValue: rule.moneyValue },
        ]
      }
      return newState
    })
  }, [])

  const addKid = useCallback((kid: Omit<KidProfile, "id" | "pointsBalance">) => {
    setState((prev) => ({
      ...prev,
      kids: [...prev.kids, { ...kid, id: generateId(), pointsBalance: 0 }],
    }))
  }, [])

  const resetApp = useCallback(() => {
    currentState = resetState()
    notify()
  }, [])

  return {
    state,
    setRole,
    setCurrentKid,
    addExpense,
    addClaim,
    approveClaim,
    rejectClaim,
    addReward,
    addTask,
    addRule,
    addKid,
    resetApp,
  }
}
