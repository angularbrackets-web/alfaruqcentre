"use client";
import { useState, useEffect } from "react";

export function useNavHeight() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => setNavHeight(header.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(header);

    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return navHeight;
}
