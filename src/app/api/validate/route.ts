import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { VALIDATE_SYSTEM } from '@/lib/prompts'

const QUESTION_CONTEXTS = [
  '어떤 서비스를 만들고 싶은지에 대한 답변',
  '서비스가 해결하는 문제에 대한 답변',
  '첫 번째 고객이 누구인지에 대한 답변',
  '현재 고객들이 문제를 어떻게 해결하는지에 대한 답변',
]

export async function POST(req: Request) {
  try {
    const { input, step } = await req.json()
    if (!input || typeof input !== 'string') {
      return Response.json({ valid: false, reason: '입력값이 없습니다.' })
    }

    const context = QUESTION_CONTEXTS[step] ?? '비즈니스 관련 질문에 대한 답변'
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: VALIDATE_SYSTEM,
      prompt: `질문 맥락: ${context}\n사용자 입력: "${input.trim()}"`,
    })

    const parsed = JSON.parse(text.trim())
    return Response.json(parsed)
  } catch {
    return Response.json({ valid: true })
  }
}
