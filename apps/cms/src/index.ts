import type { Core } from '@strapi/strapi';

const CATALOG_MODELS = ['trek', 'batch', 'package', 'region', 'site-setting'];

async function resolveSlug(strapi: Core.Strapi, model: string, entry: any): Promise<string | undefined> {
  if (entry?.slug) return entry.slug;

  // batch/package have no slug of their own; the frontend purges /treks/{slug}
  if (model === 'batch' || model === 'package') {
    const documentId = entry?.trek?.documentId || entry?.trek;
    if (typeof documentId === 'string') {
      const trek = await strapi.documents('api::trek.trek').findOne({ documentId });
      return trek?.slug;
    }
    if (entry?.id) {
      const row = await strapi.db
        .query(`api::${model}.${model}`)
        .findOne({ where: { id: entry.id }, populate: ['trek'] });
      const trek = Array.isArray(row?.trek) ? row.trek[0] : row?.trek;
      return trek?.slug;
    }
  }
  return undefined;
}

function actionFromEvent(action: string): 'create' | 'update' | 'delete' {
  if (action === 'afterCreate') return 'create';
  if (action === 'afterDelete') return 'delete';
  return 'update';
}

/**
 * Contract payload (API_CONTRACT.md): { model, slug?, action }.
 * Also carries the legacy `entry`/`event` shape until the frontend receiver
 * is migrated to the contract fields only.
 */
async function triggerRevalidation(strapi: Core.Strapi, model: string, entry: any, eventAction: string) {
  const webhookUrl = process.env.WEB_REVALIDATE_URL;
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET || process.env.WEB_REVALIDATE_SECRET;

  if (!webhookUrl || !webhookSecret) {
    strapi.log.warn('[Revalidation] Missing WEB_REVALIDATE_URL or STRAPI_WEBHOOK_SECRET');
    return;
  }

  try {
    const action = actionFromEvent(eventAction);
    const slug = await resolveSlug(strapi, model, entry);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': webhookSecret,
      },
      body: JSON.stringify({
        model,
        slug,
        action,
        entry: { slug, id: entry?.id, documentId: entry?.documentId },
        event: `entry.${action}`,
      }),
    });

    if (response.ok) {
      strapi.log.info(`[Revalidation] Triggered for ${model} (${slug || entry?.id})`);
    } else {
      strapi.log.warn(`[Revalidation] Failed with status ${response.status}`);
    }
  } catch (error) {
    strapi.log.error('[Revalidation] Error:', error);
  }
}

function shouldRevalidate(event: any): boolean {
  // draftAndPublish models: skip draft saves; delete always revalidates
  const result = event.result;
  if (event.action === 'afterDelete') return true;
  return !('publishedAt' in (result || {})) || result.publishedAt != null;
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Public role: read-only catalog access (API_CONTRACT.md). Writes go only
    // through the Astro booking action with a server-side token.
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const permissions = await strapi
          .query('plugin::users-permissions.permission')
          .findMany({ where: { role: publicRole.id } });

        const requiredActions = [
          'api::region.region.find',
          'api::region.region.findOne',
          'api::trek.trek.find',
          'api::trek.trek.findOne',
          'api::batch.batch.find',
          'api::batch.batch.findOne',
          'api::package.package.find',
          'api::package.package.findOne',
          'api::site-setting.site-setting.find',
        ];

        for (const action of requiredActions) {
          const exists = permissions.some((p: any) => p.action === action);
          if (!exists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id },
            });
          }
        }

        for (const p of permissions) {
          if ((p as any).action === 'api::booking-request.booking-request.create') {
            await strapi.query('plugin::users-permissions.permission').delete({ where: { id: (p as any).id } });
            strapi.log.info('[Bootstrap] Revoked public booking-request.create (booking writes are server-token only).');
          }
        }
        strapi.log.info('Public API permissions verified: read-only expeditions catalog.');
      }
    } catch (e) {
      strapi.log.warn('Notice: Could not auto-sync public permissions: ' + (e as Error).message);
    }

    CATALOG_MODELS.forEach((model) => {
      strapi.db.lifecycles.subscribe({
        models: [`api::${model}.${model}`],
        async afterCreate(event) {
          if (shouldRevalidate(event)) await triggerRevalidation(strapi, model, event.result, 'afterCreate');
        },
        async afterUpdate(event) {
          if (shouldRevalidate(event)) await triggerRevalidation(strapi, model, event.result, 'afterUpdate');
        },
        async afterDelete(event) {
          await triggerRevalidation(strapi, model, event.result, 'afterDelete');
        },
      });
    });

    strapi.log.info('[Bootstrap] Revalidation lifecycle hooks registered for cache invalidation.');
  },
};
