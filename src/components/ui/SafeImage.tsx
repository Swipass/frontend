"use client";

/**
 * SafeImage — wraps <img> in a Client Component so onError handlers
 * don't cause SSR serialization errors in Next.js 15 / React 19.
 *
 * Falls back to a monogram badge if the image URL fails to load.
 */
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  /** Optional extra style */
  style?: React.CSSProperties;
}

export function SafeImage({ src, alt, size = 32, className = "", style }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    // Monogram fallback — first two chars of alt text
    const initials = alt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();
    return (
      <div
        className={`token-logo-fallback rounded-full shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          background: "var(--surface-3)",
          border: "1px solid var(--border)",
          color: "var(--ink-3)",
          fontSize: Math.round(size * 0.35),
          ...style,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size, ...style }}
      onError={() => setErrored(true)}
    />
  );
}
