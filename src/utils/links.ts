// ==============================|| UTILS - EXTERNAL LINKS ||============================== //

export function buildWhatsappUrl(number: string, message?: string) {
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${query}`;
}

export function buildMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function buildInstagramUrl(handle: string) {
  return `https://www.instagram.com/${handle}`;
}
