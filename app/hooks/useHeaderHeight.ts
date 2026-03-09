"use client";

import { useState, useEffect } from "react";

/**
 * Measures the fixed <header> element's height and tracks it via ResizeObserver.
 * Returns 0 on server render, updates once mounted.
 */
export function useHeaderHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setHeight(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  return height;
}
