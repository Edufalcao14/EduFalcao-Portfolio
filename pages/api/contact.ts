import { mailOptions, transporter } from '@/config/nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type ResponseData = {
  message: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  if (req.method === 'POST') {
    const data = req.body;
    if (!data.name || !data.email || !data.message) {
      return res.status(400).json({ message: 'Bad Request!' });
    }
    try {
      await transporter.sendMail({
        ...mailOptions,
        subject: `Message From ${data.name}`,
        text: data.message,
        html: ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>New Message</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-radius: 5px; } .header { font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px; } .content { font-size: 16px; color: #333333; line-height: 1.6; } .content p { margin: 10px 0; } .footer { margin-top: 20px; font-size: 14px; color: #999999; } </style> </head> <body> <div class="email-container"> <div class="header">Message From ${data.name}</div> <div class="content"> <p><strong>Email:</strong> ${data.email}</p> <p><strong>Message:</strong></p> <p>${data.message}</p> </div> <div class="footer"> <p>This email was sent from the contact form on your website.</p> </div> </div> </body> </html> `,
      });
      return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error ) {
      console.log(error);
      return res.status(400).json({ message: (error as Error).message });
    }
  } else {
    res.status(400).json({ message: 'Bad Request!' });
  }
};

export default handler;
