import { NextRequest, NextResponse } from 'next/server'
import { transporter, mailOptions } from '@/config/nodemailer'
import { contactFormSchema } from '@/lib/schemas/contactFormSchema'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const result = contactFormSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ message: 'Bad Request!' }, { status: 400 })
  }

  const { name, email, message } = result.data

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `Message From ${name}`,
      text: message,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Message</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-radius: 5px; }
              .header { font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px; }
              .content { font-size: 16px; color: #333333; line-height: 1.6; }
              .content p { margin: 10px 0; }
              .footer { margin-top: 20px; font-size: 14px; color: #999999; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">Message From ${name}</div>
              <div class="content">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              </div>
              <div class="footer">
                <p>This email was sent from the contact form on your website.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ message: 'Email sent successfully!' })
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 })
  }
}
