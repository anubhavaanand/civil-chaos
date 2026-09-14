# BOOKING_FLOW  -  request-to-WhatsApp booking (Phase 1, no payments)

## User flow
1. Trek page → "Request Booking" CTA → opens BookingModal (or `/treks/[slug]#book`) with: name, Indian mobile (required), email (optional), group size, preferred batch dropdown (from open batches) or free-text dates, message.
2. Submit → Astro Action `booking` (see API_CONTRACT).
3. Success screen: big WhatsApp button (`whatsappUrl` deep link with prefilled summary: trek, dates, group size, name) + "we'll confirm on WhatsApp/call within a few hours" + fallback phone number. ALSO opens option to just call.
4. Agency side: Strapi `afterCreate` lifecycle on booking-request → email to agency (customer details + trek + dates) + entry appears in Strapi admin with status `new`.

## Server-side implementation
- Astro Action with zod schema: `customerName (2-60)`, `phone ^[6-9]\d{9}$`, `email? email`, `groupSize int 1-30`, relations resolved server-side by slug/id (never trust client ids for trek price).
- Honeypot: hidden `company` field; if filled → return 200 `{ok:false}` quietly.
- Rate limit: 3 submissions / min / IP (KV/in-memory edge map; on Pages use a simple Workers KV or Durable Object; acceptable: token bucket in action module for prototype + Cloudflare rate-limiting rule as backstop).
- Create Strapi entry with server token; set `sourceIp`; never expose Strapi admin token to client.
- On Strapi 5xx → 503 response that STILL hands the user the raw WhatsApp deep link (booking never dies).

## WhatsApp deep link format
`https://wa.me/{siteSetting.whatsappNumber}?text=Hi! I want to book *{trekName}* ({batchDates|preferredDates}), group of {n}.  -  {customerName}`
URL-encode; keep under WhatsApp limits.

## Email notification (backup/record)
Strapi lifecycle `afterCreate` → Resend (or SMTP) to agency email: new-booking template with all fields + direct link to the Strapi admin entry. Fail silently (WhatsApp is primary).

## Admin workflow (document for the agency)
Strapi admin → Booking Requests: mark new → contacted → confirmed/closed. Phase 2 adds payment status here.

## Spam/abuse stance
No CAPTCHA (conversion killer). Honeypot + IP rate limit + server-side phone validation covers ~95% of bots. Monitor after launch; add Cloudflare Turnstile later ONLY if real spam observed.

## Phase 2 path (do not build)
Same action gains: availability double-check → Razorpay order → payment webhook updates booking + batch seatsBooked → confirmation email/WhatsApp template. Schema already has relations + status enum to absorb this.
