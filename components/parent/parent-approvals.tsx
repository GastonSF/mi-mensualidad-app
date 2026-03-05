"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/hooks/use-app-state"
import { Check, X, Star, Clock, CheckCircle2, Gift } from "lucide-react"
import { toast } from "sonner"

export function ParentApprovals() {
  const { state, approveClaim, rejectClaim } = useAppState()

  const pendingClaims = state.claims.filter((c) => c.status === "pending")
  const resolvedClaims = state.claims
    .filter((c) => c.status !== "pending")
    .slice(-10)
    .reverse()

  function getKidName(kidId: string) {
    return state.kids.find((k) => k.id === kidId)?.name || "Desconocido"
  }

  function handleApprove(claimId: string) {
    approveClaim(claimId)
    toast.success("Solicitud aprobada")
  }

  function handleReject(claimId: string) {
    rejectClaim(claimId)
    toast.info("Solicitud rechazada")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Pending */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Pendientes
          </h2>
          {pendingClaims.length > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              {pendingClaims.length}
            </Badge>
          )}
        </div>

        {pendingClaims.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <p className="text-sm text-muted-foreground">No hay solicitudes pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingClaims.map((claim) => (
              <Card key={claim.id} className="border-2 border-primary/20">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {getKidName(claim.kidId)}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {claim.type === "task" ? "Tarea" : "Premio"}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{claim.refTitle}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-accent-foreground" />
                        <span className="text-xs font-bold text-accent-foreground">
                          {claim.type === "task" ? "+" : "-"}{claim.points} pts
                        </span>
                        <span className="text-xs text-muted-foreground">{claim.date}</span>
                      </div>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-1 bg-success text-success-foreground hover:bg-success/90"
                      onClick={() => handleApprove(claim.id)}
                    >
                      <Check className="h-4 w-4" /> Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleReject(claim.id)}
                    >
                      <X className="h-4 w-4" /> Rechazar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {resolvedClaims.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-foreground">Historial</h3>
          <div className="flex flex-col gap-2">
            {resolvedClaims.map((claim) => (
              <Card key={claim.id} className="border-border">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    claim.type === "task" ? "bg-success/10" : "bg-accent/10"
                  }`}>
                    {claim.type === "task" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Gift className="h-4 w-4 text-accent-foreground" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-xs font-medium text-foreground">
                      {getKidName(claim.kidId)} - {claim.refTitle}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{claim.date}</span>
                  </div>
                  <Badge
                    variant={claim.status === "approved" ? "default" : "destructive"}
                    className="text-[10px]"
                  >
                    {claim.status === "approved" ? "Aprobado" : "Rechazado"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
