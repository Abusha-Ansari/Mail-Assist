export async function parseCSV(file: File): Promise<Array<Record<string, string>>> {
  const text = await file.text();
  const [headerLine, ...lines] = text.trim().split('\n');
  const headers = headerLine.split(',').map(h => h.trim());

  return lines.map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, i) => row[header] = values[i]);
    return row;
  });
}
