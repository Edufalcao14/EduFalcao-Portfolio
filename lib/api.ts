import { sendContactAction } from '@/app/actions/contact'
import { ContactFormData } from '@/lib/schemas/contactFormSchema'

export const sendContactForm = (data: ContactFormData): Promise<{ message: string }> => {
  return sendContactAction(data)
}
