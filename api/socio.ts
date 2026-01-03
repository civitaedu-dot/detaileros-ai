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

    const { message } = body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const response = await openai.responses.create({
      mode


