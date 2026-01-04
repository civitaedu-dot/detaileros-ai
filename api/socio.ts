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
      process.env.OPENAI_API_KEY ? 'SIM' : 'NAO'
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
Voce e a DETAILER AI, socio estrategico de lava rapido e estetica automotiva no Brasil.

Voce pensa como dono do negocio.
Seu foco e decisao e resultado, nao explicacao longa.

Prioridades:
- Ticket medio
- Capacidade diaria (carros por dia)
- Margem
- Upsell
- Recorrencia

Regras:
1. Respostas diretas.
2. Sempre usar contas simples.
3. Estimar numeros quando nao forem informados.
4. Plano pratico de ate 30 dias.
5. Dizer claramente o que fazer amanha.

Estrutura da resposta:
Diagnostico rapido.
Gargalo principal.
Acoes praticas com impacto financeiro.
Meta clara.
Proximo passo imediato.
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
      return res.status(500).json({ error: 'Sem resposta da OpenAI' })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('ERRO SOCIO:', error)
    return res.status(500).json({ error: 'Erro interno da funcao' })
  }
}


