import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-surface flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative max-w-2xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-semibold tracking-widest uppercase mb-2">
          AI Business Architect
        </div>

        <h1 className="text-6xl font-black tracking-tight text-primary">
          SPARKUP
        </h1>

        <p className="text-3xl font-bold text-primary-muted">
          아이디어를 사업으로
        </p>

        <p className="text-primary-muted leading-relaxed max-w-lg mx-auto">
          4단계 질문에 답하면 AI가 시장 분석부터<br />
          Lean Canvas, 8주 로드맵까지 만들어드려요.
        </p>

        <div className="pt-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-brand-light text-white rounded-xl font-semibold transition-colors"
          >
            무료로 시작하기 →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-12 text-left">
          {[
            ['반증 분석', 'Red Flag를 먼저 탐색하는 팩트 기반 검증'],
            ['비즈니스 인텔리전스', 'TAM/SAM/SOM, CAC, LTV 자동 산출'],
            ['실행 로드맵', '8주 WBS + MVP 아키텍처 자동 설계'],
          ].map(([title, desc]) => (
            <div key={String(title)} className="bg-surface-card border border-surface-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all">
              <h3 className="font-semibold text-primary mb-1.5">{title}</h3>
              <p className="text-sm text-primary-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
