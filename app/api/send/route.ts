import { EmailProps } from '@/interfaces/interfaces';
import { EmailTemplate } from '@/templates/EmailTemplate';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(Req: NextRequest) {

    const emailData:EmailProps = await Req.json();

    if (!emailData.to || !emailData.from || !emailData.subject || !emailData.bodyMessage) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <mailAssist@abusha.tech>',
      to: [`${emailData.to}`],
      subject: `${emailData.subject}`,
      react: EmailTemplate({ Body: `${emailData.bodyMessage}` }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}