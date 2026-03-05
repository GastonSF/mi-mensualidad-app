export type Role = "parent" | "kid"

export type ExpenseCategory = "food" | "games" | "transport" | "school" | "other"

export type RewardType = "money" | "item"

export type ClaimType = "task" | "reward"

export type ClaimStatus = "pending" | "approved" | "rejected"

export type RuleFrequency = "one-time" | "daily" | "weekly"

export type RuleCategory = "reward" | "penalty"

export interface KidProfile {
  id: string
  name: string
  age: number
  monthlyAllowance: number
  pointsBalance: number
}

export interface Expense {
  id: string
  kidId: string
  amount: number
  category: ExpenseCategory
  note: string
  date: string
}

export interface Reward {
  id: string
  title: string
  pointsCost: number
  rewardType: RewardType
  moneyValue?: number
}

export interface Task {
  id: string
  title: string
  points: number
}

export interface Rule {
  id: string
  title: string
  points: number
  moneyValue?: number
  category: RuleCategory
  frequency: RuleFrequency
  type: "task" | "reward"
}

export interface Claim {
  id: string
  kidId: string
  type: ClaimType
  refId: string
  refTitle: string
  points: number
  status: ClaimStatus
  date: string
}

export interface AppState {
  currentRole: Role | null
  currentKidId: string | null
  kids: KidProfile[]
  expenses: Expense[]
  rewards: Reward[]
  tasks: Task[]
  rules: Rule[]
  claims: Claim[]
}
