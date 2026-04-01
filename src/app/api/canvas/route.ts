import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { CANVAS_SYSTEM } from '@/lib/prompts'

export async function POST(req: Request) {
  const { idea } = await req.json()
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: CANVAS_SYSTEM,
    prompt: idea,
  })
  return Response.json(JSON.parse(text))
}
