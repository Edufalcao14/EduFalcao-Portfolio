'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { checkRateLimit } from '@/lib/rate-limit'
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contactFormSchema'

/**
 * Contact messages now land in the Payload `contact-messages` collection instead
 * of being emailed through a Gmail app password.
 *
 * Two things the old action got wrong and this one does not: it validates on the
 * server (a server action is a public endpoint, so a client-side zod check proves
 * nothing), and it never interpolates the visitor's input into HTML.
 */
export async function sendContactAction(data: ContactFormData): Promise<{ message: string }> {
  const headerList = await headers()

  // Behind a reverse proxy the socket address is the proxy; the real client
  // address arrives in a forwarded header.
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || headerList.get('x-real-ip') || 'unknown'

  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    throw new Error(
      `Too many messages from here. Try again in ${limit.retryAfterMinutes} minutes.`,
    )
  }

  const parsed = contactFormSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error('Please check the fields and try again.')
  }

  const payload = await getPayload({ config })

  await payload.create({
    collection: 'contact-messages',
    // The collection denies `create` to everyone; only this action writes to it.
    overrideAccess: true,
    data: {
      ...parsed.data,
      read: false,
      meta: {
        userAgent: headerList.get('user-agent') ?? undefined,
        referer: headerList.get('referer') ?? undefined,
      },
    },
  })

  return { message: 'Email sent successfully!' }
}
