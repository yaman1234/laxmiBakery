import { siteConfig } from '../config/siteConfig';

/** Format price in Nepali Rupees for display and WhatsApp messages. */
export const formatCurrency = (amount: number): string => `Rs. ${amount.toFixed(2)}`;

/** Effective price after discount, if any. */
export const getEffectivePrice = (price: number, discount: number): number =>
  discount > 0 ? price * (1 - discount / 100) : price;

/**
 * Build a WhatsApp deep link with a pre-filled order message.
 * Opens chat with the bakery when used as an anchor href.
 */
export const getWhatsAppOrderUrl = (productName?: string, price?: number): string => {
  const lines = [`Hi, I'd like to place an order from ${siteConfig.businessName}.`];

  if (productName) {
    lines.push('', `Product: ${productName}`);
    if (price !== undefined) {
      lines.push(`Price: ${formatCurrency(price)}`);
    }
  }

  return `${siteConfig.whatsappUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
};
