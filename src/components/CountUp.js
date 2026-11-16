"use client";

import React, { useEffect, useRef, useState } from "react";

// Counts a stat up from its last value so numbers tick into place instead of popping in
export default function CountUp({ value }) {
  const [shown, setShown] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const duration = 700;
    let frame;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const next = Math.round(from + (value - from) * (1 - Math.pow(1 - t, 3)));
      fromRef.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{shown}</>;
}