'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BatchEmailPage() {
  const { id: templateId } = useParams();
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const csv = e.target.files?.[0];
  if (!csv) return;

  Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      setRows(results.data as Record<string, string>[]);
    },
  });
};


  const previewEmails = async () => {
    const res = await fetch('/api/send-batch/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, rows }),
    });

    const data = await res.json();
    if (res.ok) setPreviews(data.previews);
    else alert(data.message);
  };

  const sendEmails = async () => {
    const res = await fetch('/api/send-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, rows }),
    });

    const data = await res.json();
    if (res.ok) alert('Emails sent!');
    else alert(data.message);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Batch Email Sender</h1>

      <Input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />

      <div className="flex gap-2 mb-6">
        <Button onClick={previewEmails} disabled={!rows.length}>Preview Emails</Button>
        <Button onClick={sendEmails} variant="secondary" disabled={!rows.length}>Send Emails</Button>
      </div>

      {previews.map((html, i) => (
        <div key={i} className="bg-gray-400 border rounded p-4 my-4">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ))}
    </div>
  );
}
