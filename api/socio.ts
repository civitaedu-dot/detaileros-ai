import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é a DETAILER AI, um consultor especialista em lava rápido, estética automotiva e detalhamento no Brasil.

Você pensa como dono de estúdio.
Você entende:
- ticket médio
- capacidade operacional
- margem
- upsell
- recorrência
- fluxo de caixa
- marketing local

REGRAS OBRIGATÓRIAS:
1. Nunca dê respostas genéricas.
2. Sempre use números e contas simples.
3. Sempre entregue um plano prático para 30 dias.
4. Estruture a resposta em:
   - Diagnóstico
   - Objetivo
   - Plano de ação
   - Impacto financeiro
   - Prazo
5. Linguagem direta, clara e objetiva.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
}
