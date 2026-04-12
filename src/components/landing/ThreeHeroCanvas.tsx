"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x171717, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    const isMobile = window.innerWidth <= 900;
    const N = isMobile ? 1200 : 2800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 260;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;
      sizes[i] = Math.random() * 1.4 + 0.2;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vO;
        void main() {
          vec3 p = position;
          p.z += sin(time * 0.18 + position.x * 0.012) * 2.0;
          float d = length(p) * 0.008;
          vO = clamp(1.0 - d, 0.05, 0.3);
          gl_PointSize = size * (1.0 + sin(time * 0.5 + position.y * 0.1) * 0.25);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying float vO;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = 1.0 - smoothstep(0.35, 1.0, d);
          gl_FragColor = vec4(0.92, 0.92, 0.92, a * vO);
        }
      `,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Chain nodes and curves (full version)
    const chainData = [
      { p: [0, 0, 0], r: 1.3 },
      { p: [-22, 8, -6], r: 0.7 },
      { p: [20, -6, -8], r: 0.75 },
      { p: [-17, -11, -12], r: 0.6 },
      { p: [19, 14, -14], r: 0.65 },
      { p: [-24, 2, -20], r: 0.55 },
      { p: [10, -18, -10], r: 0.6 },
    ];
    const nodeGrp = new THREE.Group(),
      connGrp = new THREE.Group(),
      ptGrp = new THREE.Group();
    scene.add(nodeGrp, connGrp, ptGrp);
    const nodeMeshes: { m: THREE.Mesh; ph: number; sp: number }[] = [];
    chainData.forEach((c) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(c.r, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xfafafa, transparent: true, opacity: c.r > 1 ? 0.85 : 0.45 })
      );
      m.position.set(c.p[0], c.p[1], c.p[2]);
      const rg = new THREE.Mesh(
        new THREE.RingGeometry(c.r * 1.6, c.r * 1.85, 32),
        new THREE.MeshBasicMaterial({ color: 0xd4d4d4, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
      );
      rg.rotation.x = Math.PI / 2;
      m.add(rg);
      nodeGrp.add(m);
      nodeMeshes.push({ m, ph: Math.random() * Math.PI * 2, sp: 0.35 + Math.random() * 0.3 });
    });

    const curves: { curve: THREE.QuadraticBezierCurve3; mat: THREE.LineBasicMaterial }[] = [];
    const curveIndices = [
      [0, 1], [0, 2], [0, 3], [1, 3], [0, 4], [2, 4], [1, 5], [0, 6], [2, 6], [3, 4], [4, 5], [1, 4], [3, 5],
    ];
    curveIndices.forEach(([a, b]) => {
      const pA = new THREE.Vector3(chainData[a].p[0], chainData[a].p[1], chainData[a].p[2]);
      const pB = new THREE.Vector3(chainData[b].p[0], chainData[b].p[1], chainData[b].p[2]);
      const mid = pA.clone().lerp(pB, 0.5);
      mid.y += Math.random() * 8 - 4;
      mid.z += 4;
      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
      const mat = new THREE.LineBasicMaterial({ color: 0x404040, transparent: true, opacity: 0.2 });
      const line = new THREE.Line(geo, mat);
      connGrp.add(line);
      curves.push({ curve, mat });
    });

    const ptGeoSphere = new THREE.SphereGeometry(0.16, 8, 8);
    const particlesList: { m: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; dir: number; sp: number }[] = [];
    const spawnPt = () => {
      const c = curves[Math.floor(Math.random() * curves.length)];
      const m = new THREE.Mesh(ptGeoSphere, new THREE.MeshBasicMaterial({ color: 0xfafafa, transparent: true, opacity: 0.9 }));
      ptGrp.add(m);
      particlesList.push({
        m,
        curve: c.curve,
        t: Math.random() > 0.5 ? 0 : 1,
        dir: Math.random() > 0.5 ? 1 : -1,
        sp: 0.003 + Math.random() * 0.006,
      });
    };
    for (let i = 0; i < (isMobile ? 10 : 22); i++) spawnPt();

    const hubMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vN;
        uniform float time;
        void main() {
          vN = normal;
          vec3 p = position + normal * sin(time * 1.2 + position.x * 2.0 + position.y * 1.5) * 0.05;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        uniform float time;
        void main() {
          float e = 1.0 - abs(dot(vN, vec3(0,0,1)));
          e = pow(e, 2.2);
          gl_FragColor = vec4(0.94, 0.94, 0.94, e * 0.55 + 0.04);
        }
      `,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(2.5, 64, 64), hubMat));
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(2.56, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x404040, wireframe: true, transparent: true, opacity: 0.055 })
      )
    );

    const mkOrb = (r: number, rx: number, ry: number, o: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.011, 8, 100),
        new THREE.MeshBasicMaterial({ color: 0x525252, transparent: true, opacity: o })
      );
      m.rotation.x = rx;
      m.rotation.z = ry;
      return m;
    };
    const orb1 = mkOrb(4.5, Math.PI / 3, 0, 0.3);
    const orb2 = mkOrb(6, Math.PI / 5, Math.PI / 4, 0.18);
    scene.add(orb1, orb2);

    let mouseX = 0,
      mouseY = 0;
    let currentRotX = 0,
      currentRotY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.55;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.28;
    };
    window.addEventListener("mousemove", onMouseMove);

    let time = 0;
    let spawnTimer = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;
      particleMat.uniforms.time.value = time;
      hubMat.uniforms.time.value = time;
      currentRotX += (mouseY - currentRotX) * 0.04;
      currentRotY += (mouseX - currentRotY) * 0.04;
      const rotY = currentRotY + time * 0.014;
      [nodeGrp, connGrp, ptGrp].forEach((g) => {
        g.rotation.x = currentRotX * 0.5;
        g.rotation.y = rotY;
      });
      orb1.rotation.z = time * 0.038;
      orb2.rotation.y = time * 0.055;
      nodeMeshes.forEach((n) => {
        n.m.scale.setScalar(1 + Math.sin(time * n.sp + n.ph) * 0.04);
      });
      spawnTimer += 0.016;
      if (spawnTimer > 0.7) {
        spawnTimer = 0;
        spawnPt();
      }
      for (let i = particlesList.length - 1; i >= 0; i--) {
        const p = particlesList[i];
        p.t += p.sp * p.dir;
        if (p.t >= 1 || p.t <= 0) {
          ptGrp.remove(p.m);
          particlesList.splice(i, 1);
          continue;
        }
        const pos = p.curve.getPoint(p.t);
        p.m.position.copy(pos);
        (p.m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p.t * Math.PI) * 0.95;
      }
      curves.forEach((c, i) => {
        c.mat.opacity = 0.08 + Math.sin(time * 0.4 + i * 0.7) * 0.05 + 0.08;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}