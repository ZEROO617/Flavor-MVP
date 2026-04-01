export type AnalysisResult = {
  score: number
  summary: string
  redFlags: string[]
  strengths: string[]
  marketDemand: string
  competitionLevel: string
  pivotSuggestions: string[]
  tam: string
  sam: string
  som: string
}

export type LeanCanvas = {
  problem: string[]
  customerSegments: string[]
  uvp: string
  solution: string[]
  channels: string[]
  revenueStreams: string[]
  costStructure: string[]
  keyMetrics: string[]
  unfairAdvantage: string
}

export type Roadmap = {
  weeks: { week: number; title: string; tasks: string[] }[]
  techStack: string[]
  estimatedCost: string
  mvpFeatures: string[]
}
