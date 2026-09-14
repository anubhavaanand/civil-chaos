import type { Core } from '@strapi/strapi';

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
  },
};
