"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeFinaleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const section = document.getElementById("finale");
    if (!section) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(section.offsetWidth, section.offsetHeight);
    renderer.setClearColor(0x171717, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, section.offsetWidth / section.offsetHeight, 0.1, 500);
    camera.position.z = 40;

    const isMobile = window.innerWidth <= 900;
    const N = isMobile ? 600 : 1400;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 15;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x525252, size: 0.4, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(12, 0.03, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.4 })
    );
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(18, 0.02, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x2a2a2a, transparent: true, opacity: 0.3 })
    );
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.z = Math.PI / 3;
    scene.add(ring2);

    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.008;
      ring.rotation.z = t * 0.3;
      ring2.rotation.y = t * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!section) return;
      camera.aspect = section.offsetWidth / section.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(section.offsetWidth, section.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="finale-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}