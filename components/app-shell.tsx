"use client"

import { useAppState } from "@/hooks/use-app-state"
import { LandingPage } from "@/components/landing-page"
import { KidLayout } from "@/components/kid/kid-layout"
import { ParentLayout } from "@/components/parent/parent-layout"

export function AppShell() {
  const { state, setRole } = useAppState()

  if (!state.currentRole) {
    return <LandingPage onSelectRole={setRole} />
  }

  if (state.currentRole === "kid") {
    return <KidLayout />
  }

  return <ParentLayout />
}
