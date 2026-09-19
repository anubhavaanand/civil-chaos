function batchDocumentId(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  const rel = Array.isArray(value) ? value[0] : value;
  return rel?.documentId;
}

async function adjustSeats(batchDocId: string, delta: number) {
  const batch = await strapi.documents('api::batch.batch').findOne({ documentId: batchDocId });
  if (!batch || batch.status === 'cancelled') return;

  const seatsTotal = batch.seatsTotal ?? 12;
  const seatsBooked = Math.max(0, Math.min(seatsTotal, (batch.seatsBooked ?? 0) + delta));
  const status = seatsBooked >= seatsTotal ? 'full' : 'open';

  await strapi.documents('api::batch.batch').update({
    documentId: batchDocId,
    // Generated content-type API types are not committed; fields verified against batch schema.json
    data: { seatsBooked, status } as never,
  });
  strapi.log.info(`[Booking Request] Batch ${batchDocId} seats: ${seatsBooked}/${seatsTotal} (${status})`);
}

export default {
  async beforeUpdate(event: any) {
    // Capture pre-change state so afterUpdate can detect status transitions.
    try {
      const previous = await strapi
        .db.query('api::booking-request.booking-request')
        .findOne({ where: event.params.where, populate: ['batch'] });
      event.previousEntity = previous;
    } catch (err) {
      strapi.log.warn('[Booking Request] Could not load previous entity for seat accounting: ' + (err as Error).message);
    }
  },

  async afterCreate(event: any) {
    const { result } = event;

    // Log the incoming booking request to basecamp logs
    strapi.log.info(
      `[Booking Request] New expedition inquiry created: #${result.id} for ${result.customerName} (Phone: ${result.phone}, Group Size: ${result.groupSize || 1})`
    );

    if (result.status === 'confirmed') {
      const batchDocId = batchDocumentId(result.batch);
      if (batchDocId) {
        await adjustSeats(batchDocId, result.groupSize || 1);
      }
    }

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

  async afterUpdate(event: any) {
    const { result } = event;
    const previous = event.previousEntity;
    if (!previous) return;

    const wasConfirmed = previous.status === 'confirmed';
    const isConfirmed = result.status === 'confirmed';
    if (wasConfirmed === isConfirmed) return;

    const batchDocId = batchDocumentId(result.batch) || batchDocumentId(previous.batch);
    if (!batchDocId) return;

    const seats = previous.groupSize || result.groupSize || 1;
    await adjustSeats(batchDocId, isConfirmed ? seats : -seats);
  },
};
