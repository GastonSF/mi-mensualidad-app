"use client"

import { useState, useEffect } from "react"
import { useAppState } from "@/hooks/use-app-state"
import { ParentDashboard } from "@/components/parent/parent-dashboard"
import { ParentRules } from "@/components/parent/parent-rules"
import { ParentApprovals } from "@/components/parent/parent-approvals"
import { LayoutDashboard, BookOpen, Bell, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPendingClaims } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ParentTab = "dashboard" | "rules" | "approvals"

const tabs: { id: ParentTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Panel", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "rules", label: "Reglas", icon: <BookOpen className="h-4 w-4" /> },
  { id: "approvals", label: "Aprobar", icon: <Bell className="h-4 w-4" /> },
]

export function ParentLayout() {
  const { state, setRole, setCurrentKid } = useAppState()
  const [activeTab, setActiveTab] = useState<ParentTab>("dashboard")

  const selectedKid = state.currentKidId
    ? state.kids.find((k) => k.id === state.currentKidId)
    : state.kids[0]

  useEffect(() => {
    if (!state.currentKidId && selectedKid) {
      setCurrentKid(selectedKid.id)
    }
  }, [state.currentKidId, selectedKid, setCurrentKid])

  if (!selectedKid) return null

  const pendingCount = getPendingClaims(state).length

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Mi Mensualidad
            </h1>
            
            <Button variant="secondary" size="sm">Agregar hijo</Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {selectedKid.name}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {state.kids.map((kid) => (
                  <DropdownMenuItem
                    key={kid.id}
                    onClick={() => setCurrentKid(kid.id)}
                    className={kid.id === selectedKid.id ? "bg-accent" : ""}
                  >
                    {kid.name} ({kid.age} a.)
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
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4">
        {activeTab === "dashboard" && <ParentDashboard kid={selectedKid} />}
        {activeTab === "rules" && <ParentRules />}
        {activeTab === "approvals" && <ParentApprovals />}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "approvals" && pendingCount > 0 && (
                <Badge className="absolute -top-0.5 right-1/4 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                  {pendingCount}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
