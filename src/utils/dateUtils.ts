// Tolerant date parsing helpers for event dates
export function parseServerDate(value?: string): Date {
  if (!value) return new Date(NaN);
  let v = value.trim();

  // If format uses space instead of 'T', convert it
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(v)) {
    v = v.replace(" ", "T");
  }

  // Try plain parse first
  let d = new Date(v);
  if (!isNaN(d.getTime())) return d;

  // Try treating as UTC by appending Z
  d = new Date(v + "Z");
  return d;
}

// Convert server value to a datetime-local input-friendly string (local time)
export function toLocalDateTimeInput(value?: string): string {
  if (!value) return "";
  const d = parseServerDate(value);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
