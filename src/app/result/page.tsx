'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ScoreGauge from '@/components/ScoreGauge'
import StepIndicator from '@/components/StepIndicator'
import Tag from '@/components/Tag'
import type { AnalysisResult, LeanCanvas, Roadmap } from '@/lib/types'

type Data = { analysis: AnalysisResult; canvas: LeanCanvas; roadmap: Roadmap; idea: string }

export default function ResultPage() {
  const router = useRouter()
  const [data, setData] = useState<Data | null>(null)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const raw = sessionStorage.getItem('flavor_result')
    if (!raw) { router.push('/analyze'); return }
    setData(JSON.parse(raw))
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
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface-card rounded-2xl p-6 flex flex-col items-center border border-gray-800">
            <h3 className="text-sm text-gray-400 mb-4">실현 가능성 점수</h3>
            <ScoreGauge score={a.score} />
            <p className="mt-4 text-sm text-gray-300 text-center">{a.summary}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-red-400 font-semibold mb-3">🚩 Red Flags</h3>
              <ul className="space-y-2">{a.redFlags.map((f, i) => <li key={i} className="text-sm text-gray-300 flex gap-2"><span className="text-red-400">•</span>{f}</li>)}</ul>
            </div>
            <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-emerald-400 font-semibold mb-3">✅ Strengths</h3>
              <ul className="space-y-2">{a.strengths.map((s, i) => <li key={i} className="text-sm text-gray-300 flex gap-2"><span className="text-emerald-400">•</span>{s}</li>)}</ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-gray-400 font-semibold mb-3">📊 시장 지표</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">시장 수요</span><Tag variant={a.marketDemand === 'high' ? 'green' : a.marketDemand === 'medium' ? 'amber' : 'red'}>{a.marketDemand}</Tag></div>
                <div className="flex justify-between"><span className="text-gray-500">경쟁 강도</span><Tag variant={a.competitionLevel === 'low' ? 'green' : a.competitionLevel === 'medium' ? 'amber' : 'red'}>{a.competitionLevel}</Tag></div>
                <div className="flex justify-between"><span className="text-gray-500">TAM</span><span className="text-gray-300">{a.tam}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SAM</span><span className="text-gray-300">{a.sam}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SOM</span><span className="text-gray-300">{a.som}</span></div>
              </div>
            </div>
            <div className="bg-surface-card rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-blue-400 font-semibold mb-3">🔄 피봇 제안</h3>
              <ul className="space-y-2">{a.pivotSuggestions.map((p, i) => <li key={i} className="text-sm text-gray-300 flex gap-2"><span className="text-blue-400">•</span>{p}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Problem', items: c.problem, span: 'col-span-2' },
            { title: 'Customer Segments', items: c.customerSegments, span: 'col-span-2' },
            { title: 'Unique Value Proposition', items: [c.uvp], span: 'col-span-2' },
            { title: 'Solution', items: c.solution, span: 'col-span-2' },
            { title: 'Channels', items: c.channels, span: '' },
            { title: 'Revenue Streams', items: c.revenueStreams, span: '' },
            { title: 'Cost Structure', items: c.costStructure, span: '' },
            { title: 'Key Metrics', items: c.keyMetrics, span: '' },
            { title: 'Unfair Advantage', items: [c.unfairAdvantage], span: 'col-span-2 md:col-span-4' },
          ].map(({ title, items, span }) => (
            <div key={title} className={`bg-surface-card rounded-xl p-4 border border-gray-800 ${span}`}>
              <h4 className="text-xs text-brand font-semibold mb-2 uppercase">{title}</h4>
              <ul className="space-y-1">{items.map((item, i) => <li key={i} className="text-sm text-gray-300">• {item}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-card rounded-xl p-4 border border-gray-800">
              <h4 className="text-xs text-gray-500 mb-1">Tech Stack</h4>
              <div className="flex flex-wrap gap-1">{r.techStack.map(t => <Tag key={t} variant="blue">{t}</Tag>)}</div>
            </div>
            <div className="bg-surface-card rounded-xl p-4 border border-gray-800">
              <h4 className="text-xs text-gray-500 mb-1">예상 비용</h4>
              <p className="text-lg font-semibold text-white">{r.estimatedCost}</p>
            </div>
            <div className="bg-surface-card rounded-xl p-4 border border-gray-800">
              <h4 className="text-xs text-gray-500 mb-1">MVP 핵심 기능</h4>
              <ul>{r.mvpFeatures.map((f, i) => <li key={i} className="text-sm text-gray-300">• {f}</li>)}</ul>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {r.weeks.map(w => (
              <div key={w.week} className="bg-surface-card rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-brand rounded-full flex items-center justify-center text-xs font-bold">{w.week}</span>
                  <h4 className="text-sm font-semibold">{w.title}</h4>
                </div>
                <ul className="space-y-1">{w.tasks.map((t, i) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
