import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-brand-light to-purple-400 bg-clip-text text-transparent">
          Flavor
        </h1>
        <p className="text-xl text-gray-400">
          아이디어를 넘어 실행 가능한 비즈니스로
        </p>
        <p className="text-gray-500 leading-relaxed">
          AI 반증 분석으로 확증 편향을 제거하고, 투자자 수준의 비즈니스 인텔리전스와
          실행 로드맵을 72시간이 아닌 72초 만에 생성합니다.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/analyze"
            className="px-8 py-3 bg-brand hover:bg-brand-dark rounded-lg font-semibold transition-colors">
            아이디어 검증 시작 →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-12 text-left">
          {[
            ['🔍', '반증 분석', 'Red Flag를 먼저 탐색하는 팩트 기반 검증'],
            ['📊', '비즈니스 인텔리전스', 'TAM/SAM/SOM, CAC, LTV 자동 산출'],
            ['🗺️', '실행 로드맵', '8주 WBS + MVP 아키텍처 자동 설계'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-surface-card p-4 rounded-xl border border-gray-800">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
