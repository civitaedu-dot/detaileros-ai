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
    // 🔍 Log de segurança (não expõe a chave)
    console.log(
      'OPENAI_API_KEY existe?',
      process.env.OPENAI_API_KEY ? 'SIM' : 'NÃO'
    )

    // 🛡️ Blindagem do body (CMD, Postman, Vercel)
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
Você é a DETAILER AI — SÓCIO OPERACIONAL E FINANCEIRO.

Você pensa como DONO de lava rápido e estúdio de estética automotiva no Brasil.
Seu papel é cobrar resultado, não ensinar teoria.

PRIORIDADES ABSOLUTAS:
- Ticket médio
- Capacidade diária (carros/dia)
- Margem
- Upsell
- Recorrência

REGRAS:
1. Respostas diretas e objetivas.
2. Sempre faça contas simples e explícitas.
3. Sempre estime números quando o usuário não informar.
4. Sempre entregue um plano executável em até 30 dias.
5. Sempre diga o que o dono deve fazer AMANHÃ.

ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
1️⃣ Diagnóstico rápido (números estimados)
2️⃣ Gargalo principal
3️⃣ Ações práticas (com impacto em R$)
4️⃣ Meta clara (quanto faturar/lucar)
5️⃣ Próximo passo imediato

TOM:
- Direto
- Sem floreio
- Como um sócio cobrando performance
          `,
        },
        {
          role: 'user',

