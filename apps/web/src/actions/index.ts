import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SITE_CONFIG } from '../config/site';
import { fetchStrapi } from '../lib/strapi';

// NOTE: This in-memory rate limit Map is per-process and bypassable on
// distributed hosts (Cloudflare Pages + Render run multiple worker processes).
// Phase 2 should replace with Redis/distributed rate limiting.
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 3;
}

export const server = {
  booking: defineAction({
    accept: 'form',
    input: z.object({
      trekName: z.string().min(2),
      trekSlug: z.string().min(2),
      batchId: z.string().optional(),
      batchDates: z.string().optional(),
      packageName: z.string().optional(),
      customerName: z.string().min(2, "Name must be at least 2 characters"),
      phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)"),
      email: z.string().email("Invalid email address").or(z.literal('')).optional(),
      groupSize: z.coerce.number().min(1).max(30).default(1),
      preferredDates: z.string().optional(),
      bookingType: z.enum(['whatsapp_inquiry', 'token_deposit']).default('whatsapp_inquiry'),
      message: z.string().optional(),
      company: z.string().optional() // Honeypot field
    }),
    handler: async (input, context) => {
      if (input.company && input.company.trim() !== '') {
        return { ok: false, error: 'Bot submission rejected.' };
      }

      const forwardedFor = context.request.headers.get('x-forwarded-for');
      const clientIp = forwardedFor?.split(',')[0]?.trim()
        || context.request.headers.get('cf-connecting-ip')
        || context.clientAddress
        || 'unknown';
      if (isRateLimited(clientIp)) {
        return { ok: false, error: 'Too many requests. Please wait a minute or message us directly on WhatsApp.' };
      }

      const agencyWhatsappPhone = SITE_CONFIG.phoneRaw;
      const datesText = input.batchDates || input.preferredDates || 'Flexible Dates';
      const pkgText = input.packageName || 'Standard Basecamp Package';

      const messageText =
        `Namaste Dream of The Holy Himalayas!\n\n` +
        `I want to reserve *${input.trekName}*:\n` +
        `• Package Tier: ${pkgText}\n` +
        `• Departure Window: ${datesText}\n` +
        `• Group Size: ${input.groupSize} climber(s)\n` +
        `• Name: ${input.customerName}\n` +
        `• Mobile: +91 ${input.phone}` +
        (input.email ? `\n• Email: ${input.email}` : '') +
        (input.message ? `\n• Notes: ${input.message}` : '');

      const whatsappUrl = `https://wa.me/${agencyWhatsappPhone}?text=${encodeURIComponent(messageText)}`;

      // Fail-soft: if Strapi is unreachable, user still receives the direct WhatsApp deep link.
      // fetchStrapi does not throw on network error; it returns an error-shaped response.
      await fetchStrapi('/booking-requests', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            customerName: input.customerName,
            phone: input.phone,
            email: input.email || undefined,
            groupSize: input.groupSize,
            preferredDates: `${datesText} | ${pkgText}`,
            message: input.message || undefined,
            status: 'new',
            sourceIp: clientIp,
            honeypot: input.company || ''
          }
        })
      });

      return {
        ok: true,
        whatsappUrl,
        customerName: input.customerName,
        trekName: input.trekName,
        packageName: pkgText,
        datesText
      };
    }
  }),

  createDepositOrder: defineAction({
    accept: 'json',
    input: z.object({
      trekSlug: z.string(),
      trekName: z.string(),
      customerName: z.string(),
      phone: z.string(),
      depositAmountINR: z.number().default(2000)
    }),
    handler: async (input) => {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        ok: true,
        orderId,
        amountPaise: Math.round(input.depositAmountINR * 100),
        currency: 'INR',
        notes: {
          trekSlug: input.trekSlug,
          customer: input.customerName,
          agency: 'Dream of The Holy Himalayas'
        }
      };
    }
  }),

  handleRazorpayWebhook: defineAction({
    accept: 'json',
    input: z.object({
      event: z.enum(['payment.captured', 'payment.failed']),
      payload: z.object({
        payment: z.object({
          entity: z.object({
            id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.string(),
            method: z.string().optional(),
            notes: z.record(z.string()).optional(),
            error_description: z.string().optional()
          })
        })
      })
    }),
    handler: async (input) => {
      const { event, payload } = input;
      const payment = payload.payment.entity;
      if (event === 'payment.captured') {
        const gstRate = 0.05;
        const totalINR = payment.amount / 100;
        const baseAmount = Math.round(totalINR / (1 + gstRate));
        const gstAmount = totalINR - baseAmount;
        return {
          ok: true,
          status: 'confirmed',
          paymentId: payment.id,
          receiptNumber: `INV-${Date.now()}`,
          financials: { totalINR, baseAmountINR: baseAmount, gstAmountINR: gstAmount, sacCode: '9985' }
        };
      }
      return {
        ok: false,
        status: 'failed',
        paymentId: payment.id,
        reason: payment.error_description || 'Payment rejected by bank.'
      };
    }
  })
};
