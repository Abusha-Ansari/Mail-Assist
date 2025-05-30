import { Block } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { to, templateId, placeholderData } = body;

  const { data, error } = await supabase
    .from("email_templates")
    .select("blocks")
    .eq("id", templateId)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const blocks = data.blocks;

  const html = blocks
    .map((block: Block) => {
      const content: string = block.content.replace(
        /{{(.*?)}}/g,
        (_: string, key: string) => placeholderData[key.trim()] || ""
      );
      const style = `text-align:${block.styles.textAlign}; font-size:${block.styles.fontSize}; color:${block.styles.color}; background-color:${block.styles.backgroundColor}; font-weight:${block.styles.fontWeight}; font-style:${block.styles.fontStyle}; text-decoration:${block.styles.textDecoration};`;

      if (block.type === "heading")
        return `<h2 style="${style}">${content}</h2>`;
      if (block.type === "button")
        return `<button style="${style}">${content}</button>`;
      return `<p style="${style}">${content}</p>`;
    })
    .join("");


    try {
  const mailResponse = await resend.emails.send({
    from: "Mail Assist <mailassist@abusha.tech>",
    to: [to],
    subject: placeholderData.subject || "No Subject",
    html,
  });

  return NextResponse.json({ mailResponse, html });
} catch (mailError: unknown) {
  const errorMessage =
    mailError instanceof Error ? mailError.message : "Failed to send email";

  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  );
}   
}
