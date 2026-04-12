"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    if (window.innerWidth <= 900) return;
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    };
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    };
    window.addEventListener("mousemove", onMove);
    animateRing();

    const interactive = document.querySelectorAll("button, a");
    const onEnter = () => {
      ring.style.width = "52px";
      ring.style.height = "52px";
      ring.style.borderColor = "rgba(255,255,255,0.6)";
    };
    const onLeave = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(255,255,255,0.35)";
    };
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => {
      window.removeEventListener("mousemove", onMove);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      cursor.remove();
      ring.remove();
    };
  }, []);
  return null;
}