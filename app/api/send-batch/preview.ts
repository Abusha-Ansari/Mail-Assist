import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { templateId, rows } = await req.json();

  if (!templateId || !Array.isArray(rows)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('email_templates')
    .select('html')
    .eq('id', templateId)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  const previews = rows.map((row: Record<string, string>) => {
    let rendered = data.html;
    for (const key in row) {
      rendered = rendered.replaceAll(`{{${key}}}`, row[key]);
    }
    return rendered;
  });

  return NextResponse.json({ previews }, { status: 200 });
}
