export const config = {
  runtime: 'nodejs',
}
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

  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: `
Você é um sócio especialista em estética automotiva e lava rápidos.
Ajude donos de estúdios a:
- Aumentar faturamento
- Melhorar ticket médio
- Criar ofertas inteligentes
- Organizar financeiro
- Melhorar vendas e processos

Responda sempre de forma prática, direta e estratégica.
          `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const reply =
      response.output_text ||
      'Não consegui gerar uma resposta agora.'

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Erro OpenAI:', error)
    return res.status(500).json({ error: 'Erro ao processar a requisição' })
  }
}

