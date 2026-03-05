"use client"

import { useState, useEffect } from "react"
import { useAppState } from "@/hooks/use-app-state"
import { KidDashboard } from "@/components/kid/kid-dashboard"
import { KidExpenses } from "@/components/kid/kid-expenses"
import { KidRewards } from "@/components/kid/kid-rewards"
import { KidTasks } from "@/components/kid/kid-tasks"
import { LayoutDashboard, Receipt, Gift, CheckSquare, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type KidTab = "dashboard" | "expenses" | "rewards" | "tasks"

const tabs: { id: KidTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Inicio", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "expenses", label: "Gastos", icon: <Receipt className="h-4 w-4" /> },
  { id: "rewards", label: "Premios", icon: <Gift className="h-4 w-4" /> },
  { id: "tasks", label: "Tareas", icon: <CheckSquare className="h-4 w-4" /> },
]

export function KidLayout() {
  const { state, setRole, setCurrentKid } = useAppState()
  const [activeTab, setActiveTab] = useState<KidTab>("dashboard")

  const currentKid = state.currentKidId
    ? state.kids.find((k) => k.id === state.currentKidId)
    : state.kids[0]

  useEffect(() => {
    if (!state.currentKidId && currentKid) {
      setCurrentKid(currentKid.id)
    }
  }, [state.currentKidId, currentKid, setCurrentKid])

  if (!currentKid) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              {currentKid.name[0]}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 px-1 font-bold">
                  {currentKid.name}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {state.kids.map((kid) => (
                  <DropdownMenuItem
                    key={kid.id}
                    onClick={() => setCurrentKid(kid.id)}
                    className={kid.id === currentKid.id ? "bg-accent" : ""}
                  >
                    {kid.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRole(null)
              setCurrentKid(null)
            }}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-4">
        {activeTab === "dashboard" && <KidDashboard kid={currentKid} />}
        {activeTab === "expenses" && <KidExpenses kid={currentKid} />}
        {activeTab === "rewards" && <KidRewards kid={currentKid} />}
        {activeTab === "tasks" && <KidTasks kid={currentKid} />}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
