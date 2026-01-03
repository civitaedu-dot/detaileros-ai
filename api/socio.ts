import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Você é um sócio especialista em estética automotiva e lava rápidos.
Seu papel é ajudar donos de estúdios a:
- Aumentar faturamento
- Melhorar ticket médio
- Criar ofertas inteligentes
- Organizar controle financeiro
- Melhorar vendas, estoque e compras

Responda sempre de forma prática, estratégica e direta.
`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const reply = completion.choices[0].message.content

    return res.status(200).json({ reply })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao conectar com a OpenAI' })
  }
}
