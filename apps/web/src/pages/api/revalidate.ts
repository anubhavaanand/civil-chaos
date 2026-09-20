import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secret = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.STRAPI_WEBHOOK_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Unauthorized: invalid revalidate secret' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await request.json();
    const { model, slug, action } = body;

    // Log revalidation event for edge / cache invalidation
    console.log(`[Revalidation Webhook] model=${model} action=${action} slug=${slug || 'N/A'}`);

    return new Response(
      JSON.stringify({
        ok: true,
        revalidated: true,
        model,
        slug,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: 'An internal error occurred' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
