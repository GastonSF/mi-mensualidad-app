"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/hooks/use-app-state"
import type { KidProfile } from "@/lib/types"
import { CheckCircle2, Star, Clock } from "lucide-react"
import { toast } from "sonner"

interface KidTasksProps {
  kid: KidProfile
}

export function KidTasks({ kid }: KidTasksProps) {
  const { state, addClaim } = useAppState()

  function handleClaim(taskId: string, title: string, points: number) {
    const hasPending = state.claims.some(
      (c) => c.kidId === kid.id && c.refId === taskId && c.status === "pending"
    )
    if (hasPending) {
      toast.error("Ya tienes una solicitud pendiente para esta tarea")
      return
    }
    addClaim({
      kidId: kid.id,
      type: "task",
      refId: taskId,
      refTitle: title,
      points,
    })
    toast.success("Solicitud enviada, espera la aprobacion")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Tareas y Habitos
        </h2>
        <Badge variant="secondary" className="gap-1 font-bold">
          <Star className="h-3 w-3" />
          {kid.pointsBalance} pts
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Completa tareas para ganar puntos. Tu papa/mama debe aprobarlas.
      </p>

      <div className="flex flex-col gap-3">
        {state.tasks.map((task) => {
          const pendingClaim = state.claims.find(
            (c) => c.kidId === kid.id && c.refId === task.id && c.status === "pending"
          )
          return (
            <Card key={task.id} className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-accent-foreground" />
                    <span className="text-xs font-bold text-accent-foreground">+{task.points} pts</span>
                  </div>
                </div>
                {pendingClaim ? (
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Pendiente
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-success text-success hover:bg-success hover:text-success-foreground"
                    onClick={() => handleClaim(task.id, task.title, task.points)}
                  >
                    Completar
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
