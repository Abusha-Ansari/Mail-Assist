// File: app/api/send-batch/preview.ts
import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

interface Block {
  id: string;
  type: string;
  styles: Record<string, string>;
  content: string;
}

export async function POST(req: NextRequest) {
  const { templateId, rows } = await req.json();

  if (!templateId || !Array.isArray(rows)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('email_templates')
    .select('blocks')
    .eq('id', templateId)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  const previews = rows.map((row: Record<string, string>) => {
    const html = data.blocks.map((block: Block) => {
      let content = block.content;
      for (const key in row) {
        content = content.replaceAll(`{{${key}}}`, row[key]);
      }
      return `<div style="${Object.entries(block.styles).map(([k, v]) => `${k}: ${v}`).join(';')}">${content}</div>`;
    }).join('');

    return html;
  });

  return NextResponse.json({ previews }, { status: 200 });
}
