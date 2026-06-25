/**
 * Returns the correct image URL considering the basePath.
 * For static export with basePath /benso, images in public/ are served
 * at /benso/... not /images/...
 */
const BASE_PATH = '/benso';

export function imgSrc(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // If it already has the basePath prefix, return as-is
  if (path.startsWith(BASE_PATH)) return path;
  return `${BASE_PATH}${path}`;
}
