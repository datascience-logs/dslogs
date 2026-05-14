'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset all UI overlays on route change
    const cleanup = () => {
      // Force hide mobile menu
      document.body.classList.remove('menu-open');
      // Clear any stuck modals via event
      window.dispatchEvent(new CustomEvent('dslogs:reset-ui'));
    };
    cleanup();
  }, [pathname]);

  return null;
}
