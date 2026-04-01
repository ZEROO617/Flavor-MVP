'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { id: 'idea', label: '어떤 서비스를 만들고 싶으신가요?', placeholder: '예: 프리랜서를 위한 AI 기반 세금 자동 계산 앱' },
  { id: 'problem', label: '이 서비스가 해결하는 문제는 무엇인가요?', placeholder: '예: 프리랜서들이 세금 신고를 어려워하고, 세무사 비용이 부담됨' },
  { id: 'customer', label: '첫 번째 고객은 누구인가요?', placeholder: '예: 연매출 5천만 원 이하의 1인 프리랜서' },
  { id: 'existing', label: '현재 고객들은 이 문제를 어떻게 해결하나요?', placeholder: '예: 엑셀로 직접 계산하거나, 세무사에게 월 10만 원 지불' },
]

export default function AnalyzePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')

  const q = QUESTIONS[step]

  async function handleNext() {
    const updated = { ...answers, [q.id]: input }
    setAnswers(updated)
    setInput('')

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    const idea = `서비스: ${updated.idea}\n문제: ${updated.problem}\n고객: ${updated.customer}\n현재 해결법: ${updated.existing}`

    try {
      const [analysis, canvas, roadmap] = await Promise.all([
        fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea }) }).then(r => r.json()),
        fetch('/api/canvas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea }) }).then(r => r.json()),
        fetch('/api/roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea }) }).then(r => r.json()),
      ])
      sessionStorage.setItem('flavor_result', JSON.stringify({ analysis, canvas, roadmap, idea: updated.idea }))
      router.push('/result')
    } catch {
      alert('분석 중 오류가 발생했습니다. API 키를 확인해주세요.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-brand border-t-transparent rounded-full" />
        <p className="mt-4 text-gray-400">AI가 반증 분석 중입니다...</p>
        <p className="text-sm text-gray-600 mt-2">약 15-30초 소요</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-6">
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? 'bg-brand' : 'bg-surface-hover'}`} />
          ))}
        </div>
        <p className="text-sm text-gray-500">Step {step + 1} / {QUESTIONS.length}</p>
        <h2 className="text-2xl font-bold">{q.label}</h2>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          className="w-full bg-surface-card border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand resize-none"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && input.trim()) { e.preventDefault(); handleNext() }}}
        />
        <div className="flex justify-between">
          <button onClick={() => { setStep(Math.max(0, step - 1)); setInput(answers[QUESTIONS[Math.max(0, step - 1)]?.id] || '') }}
            disabled={step === 0}
            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30">
            ← 이전
          </button>
          <button onClick={handleNext} disabled={!input.trim()}
            className="px-8 py-2 bg-brand hover:bg-brand-dark rounded-lg font-semibold disabled:opacity-30 transition-colors">
            {step === QUESTIONS.length - 1 ? 'AI 분석 시작 🚀' : '다음 →'}
          </button>
        </div>
      </div>
    </main>
  )
}
