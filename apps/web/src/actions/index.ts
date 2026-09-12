import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  // 1. Direct WhatsApp Booking Request Handler with Honeypot Anti-Bot Filter
  booking: defineAction({
    accept: 'form',
    input: z.object({
      trekName: z.string().min(2),
      trekSlug: z.string().min(2),
      batchDates: z.string().optional(),
      customerName: z.string().min(2, "Name must be at least 2 characters"),
      phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)"),
      email: z.string().email("Invalid email address").or(z.literal('')).optional(),
      groupSize: z.coerce.number().min(1).max(30).default(1),
      preferredDates: z.string().optional(),
      bookingType: z.enum(['whatsapp_inquiry', 'token_deposit']).default('whatsapp_inquiry'),
      message: z.string().optional(),
      company: z.string().optional() // Honeypot field (must remain empty)
    }),
    handler: async (input) => {
      // Honeypot check for bots
      if (input.company && input.company.trim() !== '') {
        return {
          ok: false,
          error: 'Bot submission rejected.'
        };
      }

      const agencyWhatsappPhone = '919876543210';
      const datesText = input.batchDates || input.preferredDates || 'Flexible Dates';

      const messageText = `Hi! I want to reserve *${input.trekName}* (${datesText}) for ${input.groupSize} trekker(s).\n- Name: ${input.customerName}\n- Mobile: ${input.phone}\n- Booking Type: ${input.bookingType === 'token_deposit' ? '₹2,000 Token Deposit Reservation' : 'Direct Inquiry'}${input.email ? `\n- Email: ${input.email}` : ''}${input.message ? `\n- Note: ${input.message}` : ''}`;

      const whatsappUrl = `https://wa.me/${agencyWhatsappPhone}?text=${encodeURIComponent(messageText)}`;

      return {
        ok: true,
        whatsappUrl,
        customerName: input.customerName,
        trekName: input.trekName,
        bookingType: input.bookingType
      };
    }
  }),

  // 2. Razorpay Tokenized Partial Booking Deposit Order (Phase 2 Ready)
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
      // Razorpay order creation (mock order for Phase 1 / Phase 2 integration)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        ok: true,
        orderId,
        amountPaise: input.depositAmountINR * 100,
        currency: 'INR',
        notes: {
          trekSlug: input.trekSlug,
          customer: input.customerName,
          agency: 'Dream of The Holy Himalayas'
        }
      };
    }
  }),

  // 3. Razorpay Webhook Event Processor (payment.captured / payment.failed)
  handleRazorpayWebhook: defineAction({
    accept: 'json',
    input: z.object({
      event: z.enum(['payment.captured', 'payment.failed']),
      payload: z.object({
        payment: z.object({
          entity: z.object({
            id: z.string(),
            amount: z.number(), // in paise
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
        const gstRate = 0.05; // 5% SAC 9985
        const totalINR = payment.amount / 100;
        const baseAmount = Math.round(totalINR / (1 + gstRate));
        const gstAmount = totalINR - baseAmount;

        return {
          ok: true,
          status: 'confirmed',
          paymentId: payment.id,
          receiptNumber: `INV-${Date.now()}`,
          financials: {
            totalINR,
            baseAmountINR: baseAmount,
            gstAmountINR: gstAmount,
            sacCode: '9985'
          }
        };
      } else {
        return {
          ok: false,
          status: 'failed',
          paymentId: payment.id,
          reason: payment.error_description || 'Payment rejected by bank.'
        };
      }
    }
  })
};
