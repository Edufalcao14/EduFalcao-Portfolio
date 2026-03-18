import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(500),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
