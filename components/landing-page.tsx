"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Users, Star, TrendingUp } from "lucide-react"
import type { Role } from "@/lib/types"

interface LandingPageProps {
  onSelectRole: (role: Role) => void
}

export function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-balance text-center text-4xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Mi Mensualidad
          </h1>
          <p className="text-balance text-center text-base leading-relaxed text-muted-foreground">
            Aprende a manejar tu dinero de forma divertida y responsable.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Star className="h-3.5 w-3.5" /> Puntos
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
            <TrendingUp className="h-3.5 w-3.5" /> Metas
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            <Wallet className="h-3.5 w-3.5" /> Control
          </span>
        </div>

        {/* Role buttons */}
        <div className="flex w-full flex-col gap-3">
          <Button
            size="lg"
            className="h-14 w-full text-base font-bold"
            onClick={() => onSelectRole("parent")}
          >
            <Users className="mr-2 h-5 w-5" />
            Soy Padre / Madre
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-full border-2 border-primary text-base font-bold text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => onSelectRole("kid")}
          >
            <Star className="mr-2 h-5 w-5" />
            Soy Hijo / Hija
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Datos guardados localmente en tu dispositivo.
        </p>
      </div>
    </main>
  )
}
