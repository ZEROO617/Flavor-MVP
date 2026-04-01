import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { ANALYZE_SYSTEM } from '@/lib/prompts'

export async function POST(req: Request) {
  try {
    // 1. 환경변수 존재 확인
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OPENAI_API_KEY is not set' },
        { status: 500 }
      )
    }

    const { idea } = await req.json()

    // 2. AI 호출
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: ANALYZE_SYSTEM,
      prompt: idea,
    })

    // 3. JSON 파싱
    const parsed = JSON.parse(text)
    return Response.json(parsed)

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[analyze] Error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
