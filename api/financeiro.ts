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
Você é a DETAILER AI - MÓDULO FINANCEIRO.

Você é um consultor financeiro especialista em lava rápido e estética automotiva no Brasil.
Seu foco NÃO é motivar, é trazer clareza financeira.

SEU PAPEL:
- Calcular lucro real
- Avaliar margem
- Identificar desperdícios
- Definir ponto de equilíbrio
- Ajudar o dono a tomar decisões financeiras melhores

REGRAS OBRIGATÓRIAS:
1. Sempre pense em LUCRO antes de faturamento.
2. Sempre estime números quando o usuário não fornecer.
3. Sempre faça contas simples e explícitas.
4. Sempre explique onde o dinheiro está sendo perdido ou ganho.
5. Responda como um CFO consultor, direto e técnico.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1️⃣ Diagnóstico financeiro estimado
2️⃣ Margem atual (estimada)
3️⃣ Ponto de equilíbrio
4️⃣ O que está errado financeiramente
5️⃣ Plano de correção (ações práticas)

Se faltar informação, assuma valores realistas e deixe isso claro.
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
    console.error('ERRO FINANCEIRO:', error)
    return res.status(500).json({ error: 'Erro interno da função' })
  }
}
