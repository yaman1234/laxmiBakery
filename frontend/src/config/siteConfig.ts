/**
 * Centralized business and contact configuration for the public site.
 * Override social URLs via REACT_APP_* env vars in .env.local.
 */
export const siteConfig = {
  businessName: 'Laxmi Bakery',
  /** Traditional Nepali motto — good taste, good fortune */
  tagline: {
    nepali: 'शुभ स्वाद शुभलाभ',
    romanized: 'Shubha Swad Shubhalabh',
  },
  email: 'yamanmaharjan00@gmail.com',
  phones: ['01-5571246', '9860368155'],
  // Nepal country code (977) + mobile without leading zero
  whatsappNumber: '9779860368155',
  address: {
    line1: 'Thecho, Dhapakhel-Dobato',
    line2: 'Godawari-12, Lalitpur',
    country: 'Nepal',
    full: 'Thecho Dhapakhel-Dobato, Godawari-12, Lalitpur, Nepal',
  },
  social: {
    facebook: process.env.REACT_APP_FACEBOOK_URL ?? '',
    instagram: process.env.REACT_APP_INSTAGRAM_URL ?? '',
  },
  /** Base WhatsApp chat URL (no pre-filled message). */
  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  },
  /** Formatted phone list for display, e.g. "01-5571246, 9860368155". */
  get phoneDisplay(): string {
    return this.phones.join(', ');
  },
};
