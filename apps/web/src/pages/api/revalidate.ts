import type { APIRoute } from 'astro';

/**
 * Strapi Webhook Revalidate Endpoint
 * 
 * Called by Strapi lifecycle hooks when content changes.
 * Purges Cloudflare cache for affected pages.
 * 
 * Headers:
 *   x-revalidate-secret: Must match STRAPI_WEBHOOK_SECRET env var
 * 
 * Body (Strapi webhook payload):
 *   {
 *     "model": "trek" | "batch" | "package" | "region" | "site-setting",
 *     "entry": { "slug": "...", ... },
 *     "event": "entry.create" | "entry.update" | "entry.delete"
 *   }
 */

const REVALIDATE_SECRET = import.meta.env.STRAPI_WEBHOOK_SECRET || '';
const CF_ZONE_ID = import.meta.env.CF_ZONE_ID || '';
const CF_API_TOKEN = import.meta.env.CF_API_TOKEN || '';
const SITE_URL = import.meta.env.PUBLIC_SITE_URL || '';

interface StrapiWebhookPayload {
  model: string;
  entry: {
    slug?: string;
    id?: number;
    documentId?: string;
  };
  event: string;
}

export const POST: APIRoute = async ({ request }) => {
  // Validate secret header
  const secret = request.headers.get('x-revalidate-secret');
  if (!secret || secret !== REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Parse payload
  let payload: StrapiWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { model, entry, event } = payload;
  const slug = entry?.slug;

  // Determine which pages to revalidate
  const pathsToRevalidate: string[] = [];

  switch (model) {
    case 'trek':
      if (slug) {
        pathsToRevalidate.push(`/treks/${slug}`);
        pathsToRevalidate.push('/treks'); // Listing page
        pathsToRevalidate.push('/'); // Homepage (featured treks)
      }
      break;
    
    case 'batch':
    case 'package':
      // These affect trek pages - revalidate homepage and listing
      pathsToRevalidate.push('/treks');
      pathsToRevalidate.push('/');
      break;
    
    case 'region':
      pathsToRevalidate.push('/treks');
      pathsToRevalidate.push('/');
      break;
    
    case 'site-setting':
      // Global settings affect all pages
      pathsToRevalidate.push('/');
      break;
    
    default:
      console.warn(`[revalidate] Unknown model: ${model}`);
  }

  // If Cloudflare credentials are configured, purge cache
  if (CF_ZONE_ID && CF_API_TOKEN && pathsToRevalidate.length > 0) {
    try {
      const files = pathsToRevalidate.map(path => `${SITE_URL}${path}`);
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ files })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        console.error('[revalidate] Cloudflare purge failed:', result);
        return new Response(JSON.stringify({ 
          error: 'Cache purge failed',
          details: result 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log(`[revalidate] Purged ${files.length} paths:`, files);
    } catch (err) {
      console.error('[revalidate] Cloudflare API error:', err);
      return new Response(JSON.stringify({ 
        error: 'Cache purge error',
        message: err instanceof Error ? err.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Log the revalidation event
  console.log(`[revalidate] ${event} on ${model}`, {
    slug,
    pathsRevalidated: pathsToRevalidate
  });

  return new Response(JSON.stringify({
    success: true,
    model,
    event,
    slug,
    pathsRevalidated: pathsToRevalidate
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
