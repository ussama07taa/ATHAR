export const siteConfig = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+212 6 61 23 45 67',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212661234567',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@athar.ma',
  city: process.env.NEXT_PUBLIC_CONTACT_CITY ?? 'Tanger, Maroc',
  shippingFreeThreshold: Number(process.env.NEXT_PUBLIC_SHIPPING_FREE_THRESHOLD ?? 500),
  shippingFee: Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? 35),
};

export function whatsappUrl(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${siteConfig.whatsapp}${text}`;
}

export function formatPhoneDisplay(phone: string): string {
  return phone;
}

export function calcShipping(subtotalAfterDiscount: number): number {
  return subtotalAfterDiscount >= siteConfig.shippingFreeThreshold ? 0 : siteConfig.shippingFee;
}
