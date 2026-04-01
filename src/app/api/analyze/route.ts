import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { ANALYZE_SYSTEM } from '@/lib/prompts'

function cleanJSON(text: string): string {
  let s = text.trim()
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    s = s.slice(start, end + 1)
  }
  return s
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 })
    }

    const { idea } = await req.json()
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: ANALYZE_SYSTEM,
      prompt: idea,
    })

    const parsed = JSON.parse(cleanJSON(text))
    return Response.json(parsed)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[analyze] Error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
