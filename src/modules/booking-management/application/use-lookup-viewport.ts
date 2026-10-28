'use client';

import { useEffect, useState, type CSSProperties } from 'react';

/** Keep the short lookup sheet above the mobile keyboard, including Safari's visual viewport. */
export function useLookupViewport(open: boolean): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties>();
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!open || !viewport) return;
    const update = () => {
      if (window.innerWidth >= 768) {
        setStyle(undefined);
        return;
      }
      const bottom = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setStyle({ bottom, maxHeight: viewport.height * 0.92 });
    };
    const frame = requestAnimationFrame(update);
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [open]);
  return open ? style : undefined;
}
