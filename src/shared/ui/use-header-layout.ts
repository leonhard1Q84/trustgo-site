'use client';

import { useEffect, useRef, useState } from 'react';

/** Keep the full navigation only while its actual localized content fits. */
export function useHeaderLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const elements = [brandRef.current, navRef.current, actionsRef.current];
    if (!container || elements.some((element) => !element)) return;

    const measure = () => {
      const styles = getComputedStyle(container);
      const available =
        container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const required = elements.reduce(
        (width, element) => width + element!.getBoundingClientRect().width,
        parseFloat(styles.columnGap) * 2
      );
      // The navigation is display:none below Desktop; use the shared compact menu.
      setCompact(navRef.current!.getBoundingClientRect().width === 0 || required > available);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    elements.forEach((element) => observer.observe(element!));
    measure();
    return () => observer.disconnect();
  }, []);

  return { containerRef, brandRef, navRef, actionsRef, compact };
}
