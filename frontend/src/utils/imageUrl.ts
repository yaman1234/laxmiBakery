import { API_BASE_URL } from '../config';

/**
 * Resolve a product or category image path to a full URL.
 * Handles absolute URLs, backend upload paths, and local fallbacks.
 */
export const resolveImageUrl = (
  imgPath: string | undefined,
  fallback = '/images/placeholder.jpg'
): string => {
  if (!imgPath) return fallback;
  if (imgPath.startsWith('http')) return imgPath;
  return `${API_BASE_URL}${imgPath}`;
};
