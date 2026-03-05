"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/hooks/use-app-state"
import type { KidProfile } from "@/lib/types"
import { Gift, Star } from "lucide-react"
import { toast } from "sonner"

interface KidRewardsProps {
  kid: KidProfile
}

export function KidRewards({ kid }: KidRewardsProps) {
  const { state, addClaim } = useAppState()

  function handleRedeem(rewardId: string, title: string, points: number) {
    if (kid.pointsBalance < points) {
      toast.error("No tienes suficientes puntos")
      return
    }
    // Check for existing pending claim
    const hasPending = state.claims.some(
      (c) => c.kidId === kid.id && c.refId === rewardId && c.status === "pending"
    )
    if (hasPending) {
      toast.error("Ya tienes una solicitud pendiente para este premio")
      return
    }
    addClaim({
      kidId: kid.id,
      type: "reward",
      refId: rewardId,
      refTitle: title,
      points,
    })
    toast.success("Solicitud enviada a tu papa/mama")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Premios
        </h2>
        <Badge variant="secondary" className="gap-1 font-bold">
          <Star className="h-3 w-3" />
          {kid.pointsBalance} pts
        </Badge>
      </div>

      <div className="flex flex-col gap-3">
        {state.rewards.map((reward) => {
          const canAfford = kid.pointsBalance >= reward.pointsCost
          return (
            <Card key={reward.id} className="border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Gift className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{reward.title}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-accent-foreground" />
                    <span className="text-xs font-bold text-accent-foreground">{reward.pointsCost} pts</span>
                    {reward.moneyValue && (
                      <span className="text-xs text-muted-foreground">
                        {" "}/ ${reward.moneyValue.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={canAfford ? "default" : "outline"}
                  disabled={!canAfford}
                  onClick={() => handleRedeem(reward.id, reward.title, reward.pointsCost)}
                >
                  Canjear
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
