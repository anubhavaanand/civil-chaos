import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { message, context } = await request.json();

    // @ts-ignore
    const env = locals.runtime?.env;
    if (!env || !env.AI) {
      console.warn("AI binding not found. Ensure AI is bound in wrangler.toml");
      return new Response(JSON.stringify({ 
        response: "I'm currently unable to process AI requests. For urgent booking or inquiries, please contact us via WhatsApp!" 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a helpful customer support bot for "Dream of The Holy Himalayas", an expert trekking agency in Uttarakhand and Himachal Pradesh.
Your goal is to assist users with their inquiries, provide information about our treks, and guide them to book via our website's booking form or WhatsApp.
Keep your responses very brief, friendly, and conversational (1-3 sentences max).
Use the following live trek data as context if the user asks about specific treks or options: ${context ? JSON.stringify(context) : 'General Inquiry'}`
      },
      {
        role: 'user',
        content: message
      }
    ];

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages
    });

    return new Response(JSON.stringify({ response: response.response }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (err: any) {
    console.error('Chat AI Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), { status: 500 });
  }
};
