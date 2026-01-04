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

CONTEXTO DO NEGÓCIO:
- Operação limitada por agenda e mão de obra
- Ticket médio é o maior alavancador de crescimento
- Upsell, recorrência e pacotes são essenciais
- Margem é mais importante que volume

REGRAS OBRIGATÓRIAS:
1. Nunca dê respostas genéricas ou de blog.
2. Sempre estime números quando o usuário não fornecer.
3. Sempre faça contas simples e explícitas.
4. Sempre entregue um plano executável em até 30 dias.
5. Sempre estruture a resposta em 5 blocos:

OBRIGATÓRIO NA RESPOSTA:
 Diagnóstico rápido da situação atual (com estimativas)
 Objetivo claro (quanto faturar / lucrar)
 Plano de ação prático (diário / semanal)
 Impacto financeiro esperado de cada ação
 Próximo passo imediato (o que fazer amanhã)

TOM:
- Direto
- Profissional
- Sem floreio
- Como um consultor pago falando com o dono do negócio

Se faltar informação, assuma valores realistas e deixe isso explícito.
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
        .json({ error: 'A OpenAI não retornou resposta' })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('ERRO REAL:', error)
    return res.status(500).json({ error: 'Erro interno da função' })
  }
}
