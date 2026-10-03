"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

// Browsers reject `size: 80mm auto` and fall back to A4, so measure the
// receipt and give the print page its exact height: one strip, no blank tail.
export default function ThermalPageSize({ widthMm }: { widthMm: number }) {
  const [heightMm, setHeightMm] = useState(297);

  useEffect(() => {
    const measure = () => {
      const sheet = document.querySelector<HTMLElement>(".invoice-sheet");
      if (!sheet) return null;
      // 96 CSS px per inch; a few mm of slack stops a stray second page.
      return Math.ceil((sheet.getBoundingClientRect().height * 25.4) / 96) + 4;
    };

    const initial = measure();
    if (initial) setHeightMm(initial);

    // Re-measure right before printing (Ctrl+P, late font loads) and commit
    // synchronously so the browser lays out the print with the new size.
    const handleBeforePrint = () => {
      const mm = measure();
      if (mm) flushSync(() => setHeightMm(mm));
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, []);

  return (
    <style>{`
      @media print {
        @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
      }
    `}</style>
  );
}
