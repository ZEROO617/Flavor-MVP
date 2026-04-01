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

export default function ResultPage() {
  const router = useRouter()
  const [data, setData] = useState<Data | null>(null)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const raw = sessionStorage.getItem('flavor_result')
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
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🔬 분석 결과: {data.idea}</h1>
        <button onClick={() => router.push('/analyze')} className="text-sm text-brand hover:underline">새 분석</button>
      </div>
      <StepIndicator current={tab} />

      <div className="flex gap-2 mb-6">
        {['반증 분석', 'Lean Canvas', '8주 로드맵'].map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === i ? 'bg-brand text-white' : 'bg-surface-card text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface-card rounded-2xl p-6 flex flex-col items-center border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-4">실현 가능성 점수</h3>
              <ScoreGauge score={a.score ?? 0} />
              <p className="mt-4 text-sm text-gray-300 text-center">{safeString(a.summary)}</p>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
                <h3 className="text-sm text-red-400 font-semibold mb-3">🚩 Red Flags</h3>
                <ul className="space-y-2">
                  {safeArray(a.redFlags).map((f, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-red-400 shrink-0">•</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
                <h3 className="text-sm text-emerald-400 font-semibold mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {safeArray(a.strengths).map((s, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-emerald-400 shrink-0">•</span><span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
                <h3 className="text-sm text-gray-400 font-semibold mb-3">📊 시장 지표</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">시장 수요</span>
                    <Tag variant={a.marketDemand === 'high' ? 'green' : a.marketDemand === 'medium' ? 'amber' : 'red'}>{safeString(a.marketDemand)}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">경쟁 강도</span>
                    <Tag variant={a.competitionLevel === 'low' ? 'green' : a.competitionLevel === 'medium' ? 'amber' : 'red'}>{safeString(a.competitionLevel)}</Tag>
                  </div>
                  <div className="flex justify-between"><span className="text-gray-500">TAM</span><span className="text-gray-300 text-right">{safeString(a.tam)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">SAM</span><span className="text-gray-300 text-right">{safeString(a.sam)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">SOM</span><span className="text-gray-300 text-right">{safeString(a.som)}</span></div>
                </div>
              </div>
              <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
                <h3 className="text-sm text-blue-400 font-semibold mb-3">🔄 피봇 제안</h3>
                <ul className="space-y-2">
                  {safeArray(a.pivotSuggestions).map((p, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-blue-400 shrink-0">•</span><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {Array.isArray(a.competitors) && a.competitors.length > 0 && (
            <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-amber-400 font-semibold mb-4">⚔️ 주요 경쟁 서비스</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {a.competitors.map((comp, i) => (
                  <div key={i} className="bg-surface rounded-xl p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-1">{safeString(comp.name)}</h4>
                    <p className="text-sm text-gray-400">{safeString(comp.description)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
            <div key={title} className={`bg-surface-card rounded-xl p-4 border border-gray-800 ${span}`}>
              <h4 className="text-xs text-brand font-semibold mb-2 uppercase">{title}</h4>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 1 && !c && (
        <div className="bg-surface-card rounded-2xl p-8 border border-gray-800 text-center">
          <p className="text-gray-400">Lean Canvas 데이터를 불러올 수 없습니다.</p>
        </div>
      )}

      {tab === 2 && r && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-card rounded-xl p-4 border border-gray-800">
              <h4 className="text-xs text-gray-500 mb-1">Tech Stack</h4>
              <div className="flex flex-wrap gap-1">{safeArray(r.techStack).map((t) => <Tag key={t} variant="blue">{t}</Tag>)}</div>
            </div>
            <div className="bg-surface-card rounded-xl p-4 border border-gray-800">
              <h4 className="text-xs text-gray-500 mb-1">예상 비용</h4>
              <p className="text-lg font-semibold text-white">{safeString(r.estimatedCost)}</p>
            </div>
            <div className="bg-surface-card rounded-xl p-4 border border-gray-800">
              <h4 className="text-xs text-gray-500 mb-1">MVP 핵심 기능</h4>
              <ul>{safeArray(r.mvpFeatures).map((f, i) => <li key={i} className="text-sm text-gray-300">• {f}</li>)}</ul>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {safeArray(r.weeks).length === 0 && (
              <p className="col-span-4 text-gray-400 text-center">로드맵 데이터를 불러올 수 없습니다.</p>
            )}
            {Array.isArray(r.weeks) && r.weeks.map((w) => (
              <div key={w.week} className="bg-surface-card rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-brand rounded-full flex items-center justify-center text-xs font-bold">{w.week}</span>
                  <h4 className="text-sm font-semibold">{safeString(w.title)}</h4>
                </div>
                <ul className="space-y-1">{safeArray(w.tasks).map((t, i) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && !r && (
        <div className="bg-surface-card rounded-2xl p-8 border border-gray-800 text-center">
          <p className="text-gray-400">로드맵 데이터를 불러올 수 없습니다.</p>
        </div>
      )}
    </main>
  )
}
