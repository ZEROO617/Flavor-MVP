'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { id: 'idea', label: '어떤 서비스를 만들고 싶으신가요?', placeholder: '예: 프리랜서를 위한 AI 기반 세금 자동 계산 앱' },
  { id: 'problem', label: '이 서비스가 해결하는 문제는 무엇인가요?', placeholder: '예: 프리랜서들이 세금 신고를 어려워하고, 세무사 비용이 부담됨' },
  { id: 'customer', label: '첫 번째 고객은 누구인가요?', placeholder: '예: 연매출 5천만 원 이하의 1인 프리랜서' },
  { id: 'existing', label: '현재 고객들은 이 문제를 어떻게 해결하나요?', placeholder: '예: 엑셀로 직접 계산하거나, 세무사에게 월 10만 원 지불' },
]

async function safeFetch(url: string, idea: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

async function validateInput(input: string, step: number): Promise<{ valid: boolean; reason?: string }> {
  try {
    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, step }),
    })
    return res.json()
  } catch {
    return { valid: true }
  }
}

export default function AnalyzePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const q = QUESTIONS[step]

  async function handleNext() {
    if (!input.trim()) return

    setValidationError('')
    setValidating(true)

    const result = await validateInput(input.trim(), step)
    setValidating(false)

    if (!result.valid) {
      setValidationError(result.reason ?? '입력 내용을 구체적으로 작성해 주세요.')
      textareaRef.current?.focus()
      return
    }

    const updated = { ...answers, [q.id]: input }
    setAnswers(updated)
    setInput('')
    setValidationError('')

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    setError('')
    const idea = `서비스: ${updated.idea}\n문제: ${updated.problem}\n고객: ${updated.customer}\n현재 해결법: ${updated.existing}`

    try {
      const [analysis, canvas, roadmap] = await Promise.all([
        safeFetch('/api/analyze', idea),
        safeFetch('/api/canvas', idea),
        safeFetch('/api/roadmap', idea),
      ])
      sessionStorage.setItem('flavor_result', JSON.stringify({ analysis, canvas, roadmap, idea: updated.idea }))
      router.push('/result')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        <p className="mt-6 text-primary-muted">AI가 반증 분석 중입니다...</p>
        <p className="text-sm text-primary-subtle mt-2">약 15-30초 소요</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <span className="text-sm font-bold tracking-widest text-primary-subtle uppercase">SPARKUP</span>
          <p className="text-xs text-primary-subtle mt-1">Step {step + 1} / {QUESTIONS.length}</p>
        </div>

        {/* 프로그레스 바 */}
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-primary' : 'bg-surface-border'
              }`}
            />
          ))}
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <p className="text-xs text-primary-subtle font-semibold uppercase tracking-widest mb-2">STEP 0{step + 1}</p>
            <h2 className="text-2xl font-bold text-primary">{q.label}</h2>
          </div>

          <div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (validationError) setValidationError('')
              }}
              placeholder={q.placeholder}
              rows={4}
              className={`w-full bg-surface-elevated border rounded-xl p-4 text-primary placeholder-primary-subtle focus:outline-none focus:ring-1 resize-none transition-colors duration-200 text-sm ${
                validationError
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-surface-border focus:border-primary/40 focus:ring-primary/10'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                  e.preventDefault()
                  handleNext()
                }
              }}
            />
            {validationError && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                <span>⚠</span>
                <span>{validationError} 다시 입력해 주세요.</span>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              <p className="font-semibold mb-1">분석 실패</p>
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                if (step === 0) {
                  router.push('/')
                  return
                }
                const prev = step - 1
                setStep(prev)
                setInput(answers[QUESTIONS[prev]?.id] || '')
                setValidationError('')
              }}
              className="px-4 py-2 rounded-lg text-primary-muted hover:text-primary transition-colors text-sm"
            >
              ← 이전
            </button>
            <button
              onClick={handleNext}
              disabled={!input.trim() || validating}
              className="px-8 py-2.5 bg-primary hover:bg-brand-light rounded-xl font-semibold text-white disabled:opacity-40 transition-colors flex items-center gap-2 text-sm"
            >
              {validating && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {step === QUESTIONS.length - 1 ? 'AI 분석 시작 →' : '다음 →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
