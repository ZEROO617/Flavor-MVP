'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ScoreGauge from '@/components/ScoreGauge'
import StepIndicator from '@/components/StepIndicator'
import Tag from '@/components/Tag'
import type { AnalysisResult, LeanCanvas, Roadmap } from '@/lib/types'

type Data = { analysis: AnalysisResult; canvas: LeanCanvas; roadmap: Roadmap; idea: string }

function safeArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String)
  return []
}

function safeString(val: unknown, fallback = '-'): string {
  if (typeof val === 'string' && val.trim()) return val
  return fallback
}

const MARKET_LABELS: Record<string, { en: string; ko: string; desc: string }> = {
  tam: {
    en: 'TAM',
    ko: '전체 시장 규모',
    desc: 'Total Addressable Market — 해당 시장의 전체 잠재 규모',
  },
  sam: {
    en: 'SAM',
    ko: '서비스 가능 시장',
    desc: 'Serviceable Available Market — 실제 서비스 제공이 가능한 시장 범위',
  },
  som: {
    en: 'SOM',
    ko: '확보 가능 시장',
    desc: 'Serviceable Obtainable Market — 초기 1년 내 실제 확보 가능한 시장',
  },
}

const CANVAS_LABELS: Record<string, string> = {
  'Problem': 'Problem (문제)',
  'Customer Segments': 'Customer Segments (고객 세그먼트)',
  'Unique Value Proposition': 'Unique Value Proposition (가치 제안)',
  'Solution': 'Solution (솔루션)',
  'Channels': 'Channels (채널)',
  'Revenue Streams': 'Revenue Streams (수익 구조)',
  'Cost Structure': 'Cost Structure (비용 구조)',
  'Key Metrics': 'Key Metrics (핵심 지표)',
  'Unfair Advantage': 'Unfair Advantage (경쟁 우위)',
}

const CARD = 'bg-surface-card border border-surface-border rounded-2xl shadow-sm'
const CARD_SM = 'bg-surface-card border border-surface-border rounded-xl shadow-sm'

export default function ResultPage() {
  const router = useRouter()
  const [data, setData] = useState<Data | null>(null)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const raw = sessionStorage.getItem('sparkup_result')
    if (!raw) { router.push('/analyze'); return }
    try {
      setData(JSON.parse(raw))
    } catch {
      router.push('/analyze')
    }
  }, [router])

  if (!data) return null
  const { analysis: a, canvas: c, roadmap: r } = data

  return (
    <main className="min-h-screen bg-surface p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">분석 결과: <span className="text-primary-muted">{data.idea}</span></h1>
        <button
          onClick={() => router.push('/analyze')}
          className="text-sm text-primary-muted hover:text-primary transition-colors"
        >
          새 분석 →
        </button>
      </div>

      <StepIndicator current={tab} />

      <div className="flex gap-2 mb-8">
        {['반증 분석', 'Lean Canvas', '8주 로드맵'].map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === i
                ? 'bg-primary text-white'
                : 'bg-surface-card text-primary-muted hover:text-primary hover:bg-surface-elevated border border-surface-border'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===== 탭 0: 반증 분석 ===== */}
      {tab === 0 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* 점수 */}
            <div className={`${CARD} p-6 flex flex-col items-center`}>
              <h3 className="text-sm text-primary-muted mb-4">실현 가능성 점수</h3>
              <ScoreGauge score={a.score ?? 0} />
              <p className="mt-4 text-sm text-primary-muted text-center leading-relaxed">{safeString(a.summary)}</p>
            </div>

            {/* Red Flags + Strengths */}
            <div className="space-y-4">
              <div className={`${CARD} p-6`}>
                <h3 className="text-sm text-red-500 font-semibold mb-3">● Red Flags</h3>
                <ul className="space-y-2">
                  {safeArray(a.redFlags).map((f, i) => (
                    <li key={i} className="text-sm text-primary-muted flex gap-2">
                      <span className="text-red-400 shrink-0">•</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${CARD} p-6`}>
                <h3 className="text-sm text-emerald-600 font-semibold mb-3">● Strengths</h3>
                <ul className="space-y-2">
                  {safeArray(a.strengths).map((s, i) => (
                    <li key={i} className="text-sm text-primary-muted flex gap-2">
                      <span className="text-emerald-500 shrink-0">•</span><span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 시장 지표 + TAM/SAM/SOM + 피봇 */}
            <div className="space-y-4">
              <div className={`${CARD} p-6`}>
                <h3 className="text-sm text-primary font-semibold mb-3">시장 지표</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-subtle">시장 수요</span>
                    <Tag variant={a.marketDemand === 'high' ? 'green' : a.marketDemand === 'medium' ? 'amber' : 'red'}>{safeString(a.marketDemand)}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-subtle">경쟁 강도</span>
                    <Tag variant={a.competitionLevel === 'low' ? 'green' : a.competitionLevel === 'medium' ? 'amber' : 'red'}>{safeString(a.competitionLevel)}</Tag>
                  </div>
                </div>
              </div>

              <div className={`${CARD} p-6`}>
                <h3 className="text-sm text-primary font-semibold mb-4">시장 규모 분석</h3>
                <div className="space-y-4">
                  {(['tam', 'sam', 'som'] as const).map((key) => {
                    const label = MARKET_LABELS[key]
                    const value = safeString((a as Record<string, unknown>)[key])
                    return (
                      <div key={key} className="border-l-2 border-primary/30 pl-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-primary">{label.en}</span>
                          <span className="text-xs text-primary-subtle">{label.ko}</span>
                        </div>
                        <p className="text-sm text-primary-muted leading-relaxed">{value}</p>
                        <p className="text-xs text-primary-subtle mt-1">{label.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={`${CARD} p-6`}>
                <h3 className="text-sm text-primary font-semibold mb-3">피봇 제안</h3>
                <ul className="space-y-2">
                  {safeArray(a.pivotSuggestions).map((p, i) => (
                    <li key={i} className="text-sm text-primary-muted flex gap-2">
                      <span className="text-primary-subtle shrink-0">•</span><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 경쟁사 섹션 */}
          {Array.isArray(a.competitors) && a.competitors.length > 0 && (
            <div className={`${CARD} p-6`}>
              <h3 className="text-sm text-primary font-semibold mb-4">주요 경쟁 서비스</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {a.competitors.map((comp, i) => (
                  <div key={i} className="bg-surface-elevated rounded-xl p-4 border border-surface-border shadow-sm">
                    <h4 className="font-semibold text-primary mb-1">{safeString(comp.name)}</h4>
                    <p className="text-sm text-primary-muted">{safeString(comp.description)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 탭 1: Lean Canvas ===== */}
      {tab === 1 && c && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Problem', items: safeArray(c.problem), span: 'col-span-2' },
            { title: 'Customer Segments', items: safeArray(c.customerSegments), span: 'col-span-2' },
            { title: 'Unique Value Proposition', items: [safeString(c.uvp)], span: 'col-span-2' },
            { title: 'Solution', items: safeArray(c.solution), span: 'col-span-2' },
            { title: 'Channels', items: safeArray(c.channels), span: '' },
            { title: 'Revenue Streams', items: safeArray(c.revenueStreams), span: '' },
            { title: 'Cost Structure', items: safeArray(c.costStructure), span: '' },
            { title: 'Key Metrics', items: safeArray(c.keyMetrics), span: '' },
            { title: 'Unfair Advantage', items: [safeString(c.unfairAdvantage)], span: 'col-span-2 md:col-span-4' },
          ].map(({ title, items, span }) => (
            <div key={title} className={`${CARD_SM} p-4 ${span}`}>
              <h4 className="text-xs text-primary-subtle font-semibold mb-2 uppercase tracking-wide">{CANVAS_LABELS[title] || title}</h4>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-sm text-primary-muted">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 1 && !c && (
        <div className={`${CARD} p-8 text-center`}>
          <p className="text-primary-muted">Lean Canvas 데이터를 불러올 수 없습니다.</p>
        </div>
      )}

      {/* ===== 탭 2: 8주 로드맵 ===== */}
      {tab === 2 && r && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className={`${CARD_SM} p-4`}>
              <h4 className="text-xs text-primary-subtle mb-2">기술 스택</h4>
              <div className="flex flex-wrap gap-1.5">{safeArray(r.techStack).map((t) => <Tag key={t} variant="blue">{t}</Tag>)}</div>
            </div>
            <div className={`${CARD_SM} p-4`}>
              <h4 className="text-xs text-primary-subtle mb-2">예상 비용</h4>
              <p className="text-lg font-semibold text-primary">{safeString(r.estimatedCost)}</p>
            </div>
            <div className={`${CARD_SM} p-4`}>
              <h4 className="text-xs text-primary-subtle mb-2">MVP 핵심 기능</h4>
              <ul>{safeArray(r.mvpFeatures).map((f, i) => <li key={i} className="text-sm text-primary-muted">• {f}</li>)}</ul>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {safeArray(r.weeks).length === 0 && (
              <p className="col-span-4 text-primary-muted text-center">로드맵 데이터를 불러올 수 없습니다.</p>
            )}
            {Array.isArray(r.weeks) && r.weeks.map((w) => (
              <div key={w.week} className={`${CARD_SM} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">{w.week}</span>
                  <h4 className="text-sm font-semibold text-primary">{safeString(w.title)}</h4>
                </div>
                <ul className="space-y-1">{safeArray(w.tasks).map((t, i) => <li key={i} className="text-xs text-primary-muted">• {t}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && !r && (
        <div className={`${CARD} p-8 text-center`}>
          <p className="text-primary-muted">로드맵 데이터를 불러올 수 없습니다.</p>
        </div>
      )}
    </main>
  )
}
