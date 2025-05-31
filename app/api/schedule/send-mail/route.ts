import { NextRequest } from "next/server";
import { Resend } from "resend";


export async function POST(request: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await request.json();

    await resend.batch.send(data)
    
}
