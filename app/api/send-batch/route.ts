import { Block } from '@/interfaces/interfaces';
import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { templateId, rows, subject } = await req.json();

    if (!templateId || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    // Fetch blocks and placeholders columns
    const { data: templateData, error } = await supabase
      .from('email_templates')
      .select('blocks, placeholders')
      .eq('id', templateId)
      .single();

    if (error || !templateData) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    const { blocks, placeholders } = templateData;

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ message: 'Template blocks are invalid' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Helper to render blocks by replacing placeholders in content
    function renderBlocks(blocks: Block[], row: Record<string, string>): string {
      // Map each block to HTML string
      return blocks
        .map((block) => {
          let content = block.content || '';

          // Replace placeholders {{key}} in content
          placeholders.forEach((key: string) => {
            const value = row[key] ?? '';
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            content = content.replace(regex, value);
          });

          // Render block as HTML depending on block type (basic handling)
          switch (block.type) {
            case 'heading':
              return `<h2 style="
                color: ${block.styles?.color || 'inherit'};
                font-size: ${block.styles?.fontSize || 'inherit'};
                font-style: ${block.styles?.fontStyle || 'normal'};
                text-align: ${block.styles?.textAlign || 'left'};
                font-weight: ${block.styles?.fontWeight || 'normal'};
                text-decoration: ${block.styles?.textDecoration || 'none'};
                background-color: ${block.styles?.backgroundColor || 'transparent'};
              ">${content}</h2>`;
            case 'text':
            default:
              return `<p style="
                color: ${block.styles?.color || 'inherit'};
                font-size: ${block.styles?.fontSize || 'inherit'};
                font-style: ${block.styles?.fontStyle || 'normal'};
                text-align: ${block.styles?.textAlign || 'left'};
                font-weight: ${block.styles?.fontWeight || 'normal'};
                text-decoration: ${block.styles?.textDecoration || 'none'};
                background-color: ${block.styles?.backgroundColor || 'transparent'};
              ">${content}</p>`;
          }
        })
        .join('');
    }

    const generatedHtmlArray: string[] = [];
    const messages = rows.map((row: Record<string, string>) => {
      const html = renderBlocks(blocks, row);
      generatedHtmlArray.push(html);

      return {
        from: 'Mail Assist <mailassist@abusha.tech>',
        to: [row.email],
        subject: `${subject}`,
        html,
      };
    });

    const result = await resend.batch.send(messages);

    return NextResponse.json({
  message: "Emails sent",
  result: {
    data: Array.isArray(result.data)
      ? result.data
      : Object.values(result.data || {}).filter(
          (item) => typeof item === "object" && item !== null && !Array.isArray(item)
        ),
  },
  renderedHtmls: generatedHtmlArray,
});



  } catch (err) {
    return NextResponse.json(
      { message: 'Error sending emails', error: (err as Error).message || err },
      { status: 500 }
    );
  }
}
