import { useEffect } from 'react';
import { useRefreshMutation } from './api';

/**
 * Hook untuk auto-refresh token sebelum expire
 * Refresh token setiap 14 menit (token biasanya expire 15 menit)
 */
export function useAutoRefreshToken() {
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    // Refresh token setiap 14 menit
    const interval = setInterval(
      () => {
        refresh()
          .unwrap()
          .catch((error) => {
            console.error('Auto refresh token failed:', error);
            // Token refresh gagal, user perlu login ulang
          });
      },
      14 * 60 * 1000
    ); // 14 minutes

    return () => clearInterval(interval);
  }, [refresh]);
}

/**
 * Alternative: Refresh token juga saat user kembali ke app setelah idle
 */
export function useRefreshTokenOnFocus() {
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const handleFocus = () => {
      refresh()
        .unwrap()
        .catch((error) => {
          console.error('Refresh token on focus failed:', error);
        });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refresh]);
}
