export default {
  async afterCreate(event: any) {
    const { result } = event;

    // Log the incoming booking request to basecamp logs
    strapi.log.info(
      `[Booking Request] New expedition inquiry created: #${result.id} for ${result.customerName} (Phone: ${result.phone}, Group Size: ${result.groupSize || 1})`
    );

    // If Strapi email plugin is enabled and admin recipient is defined, dispatch alert
    try {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
      if (adminEmail && strapi.plugins?.email) {
        await strapi.plugins.email.services.email.send({
          to: adminEmail,
          from: process.env.DEFAULT_FROM_EMAIL || 'basecamp@holyhimalayas.com',
          subject: `🏔️ New Booking Inquiry: ${result.customerName}`,
          text: `A new expedition inquiry was submitted on the website:\n\n` +
            `Name: ${result.customerName}\n` +
            `Phone: ${result.phone}\n` +
            `Email: ${result.email || 'N/A'}\n` +
            `Group Size: ${result.groupSize || 1}\n` +
            `Preferred Dates: ${result.preferredDates || 'Flexible'}\n` +
            `Message: ${result.message || 'None'}\n\n` +
            `Review in Strapi Admin: ${process.env.STRAPI_URL || 'https://civil-chaos.onrender.com'}/admin`,
        });
        strapi.log.info(`[Booking Request] Notification email successfully sent to ${adminEmail}`);
      }
    } catch (err) {
      strapi.log.error('[Booking Request] Failed to dispatch notification email:', err);
    }
  },
};
