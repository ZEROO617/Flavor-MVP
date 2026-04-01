import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { ANALYZE_SYSTEM } from '@/lib/prompts'

export async function POST(req: Request) {
  const { idea } = await req.json()
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: ANALYZE_SYSTEM,
    prompt: idea,
  })
  return Response.json(JSON.parse(text))
}
