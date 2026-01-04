export const config = {
  runtime: 'nodejs',
}

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log(
      'OPENAI_API_KEY existe?',
      process.env.OPENAI_API_KEY ? 'SIM' : 'NÃO'
    )

    const body =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const { message } = body || {}

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Você é a DETAILER AI, um sócio estratégico especialista em lava rápido e estética automotiva no Brasil.

Você pensa como DONO de estúdio, não como assistente.
Seu foco principal é AUMENTAR LUCRO, não apenas faturamento.

REGRAS:
- Nunca seja genérico
- Sempre use números
- Sempre entregue plano de 30 dias
- Sempre diga o próximo passo imediato
          `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const reply = completion.choices[0]?.message?.content

    if (!reply) {
      return res
        .status(500)
        .json({ error: 'OpenAI não retornou resposta' })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('ERRO REAL:', error)
    return res.status(500).json({ error: 'Erro interno da função' })
  }
}
