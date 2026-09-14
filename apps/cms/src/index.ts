import type { Core } from '@strapi/strapi';

/**
 * Trigger cache revalidation on the Astro frontend
 * Called by Strapi lifecycle hooks when content changes
 */
async function triggerRevalidation(strapi: Core.Strapi, model: string, entry: any, event: string) {
  const webhookUrl = process.env.WEB_REVALIDATE_URL;
  const webhookSecret = process.env.WEB_REVALIDATE_SECRET;

  if (!webhookUrl || !webhookSecret) {
    strapi.log.warn('[Revalidation] Missing WEB_REVALIDATE_URL or WEB_REVALIDATE_SECRET');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': webhookSecret,
      },
      body: JSON.stringify({
        model,
        entry: {
          slug: entry.slug,
          id: entry.id,
          documentId: entry.documentId,
        },
        event,
      }),
    });

    if (response.ok) {
      strapi.log.info(`[Revalidation] Triggered for ${model} (${entry.slug || entry.id})`);
    } else {
      strapi.log.warn(`[Revalidation] Failed with status ${response.status}`);
    }
  } catch (error) {
    strapi.log.error('[Revalidation] Error:', error);
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Automatically grant public read permissions on catalog endpoints and create on booking-requests
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
          'api::booking-request.booking-request.create',
        ];

        for (const action of requiredActions) {
          const exists = permissions.some((p: any) => p.action === action);
          if (!exists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id,
              },
            });
          }
        }
        strapi.log.info('Public API permissions verified for expeditions catalog & bookings.');
      }
    } catch (e) {
      strapi.log.warn('Notice: Could not auto-sync public permissions: ' + (e as Error).message);
    }

    // Register lifecycle hooks for cache revalidation
    const modelsToWatch = ['trek', 'batch', 'package', 'region', 'site-setting'];
    
    modelsToWatch.forEach((model) => {
      strapi.db.lifecycles.subscribe({
        models: [`api::${model}.${model}`],
        async afterCreate(event) {
          await triggerRevalidation(strapi, model, event.result, 'entry.create');
        },
        async afterUpdate(event) {
          await triggerRevalidation(strapi, model, event.result, 'entry.update');
        },
        async afterDelete(event) {
          await triggerRevalidation(strapi, model, event.result, 'entry.delete');
        },
      });
    });

    strapi.log.info('[Bootstrap] Revalidation lifecycle hooks registered for cache invalidation.');
  },
};
