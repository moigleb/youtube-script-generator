// /api/generate.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(req: NextRequest) {
  const { prompt, genre } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const systemMessage = `You are a helpful assistant that writes YouTube scripts in ${genre} style. Structure: intro, 3-5 key points, and a call to action.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const output = response.choices[0]?.message?.content;
    return NextResponse.json({ result: output });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
