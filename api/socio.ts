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
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    console.log(
      'OPENAI_API_KEY existe?',
      process.env.OPENAI_API_KEY ? 'SIM' : 'NÃO'
    )

    const body =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const { message } = body

    if (!message || typeof message !== 'string') {
      return res
        .status(400)
        .json({ error: 'O campo "message" é obrigatório.' })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Você é um sócio especialista em estética automotiva e lava rápidos.
Ajude donos de estúdios a aumentar faturamento, ticket médio,
organizar financeiro e melhorar vendas.
Responda sempre de forma prática, direta e estratégica.
          `,
        },
        { role: 'user', content: message },
      ],
    })

    const reply = completion.choices[0]?.message?.content

    if (!reply) {
      return res
        .status(500)
        .json({ error: 'A OpenAI não retornou resposta.' })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Erro OpenAI:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

