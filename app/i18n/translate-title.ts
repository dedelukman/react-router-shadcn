import { routeToKey } from "./route-to-key";
import i18n from "./i18n";

export function translateTitle(pathname: string): string {
  const key = routeToKey(pathname);
  
  if (i18n.exists(key)) {
    const translation = i18n.t(key, { returnObjects: true });
    
    // Handle nested objects
    if (typeof translation === 'object' && translation !== null) {
      // Coba ambil empty string key jika ada
      if (translation[''] !== undefined) {
        return translation[''];
      }
      // Atau kembalikan key asli
      return key;
    }
    
    return translation;
  }

  // fallback
  const segments = pathname.split('/').filter(Boolean);
  const last = segments.length ? segments[segments.length - 1] : "home";
  return last.charAt(0).toUpperCase() + last.slice(1);
}
