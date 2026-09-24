document.querySelector(".menu").onclick = () => document.querySelector(".links").classList.toggle("open");
  const io = new IntersectionObserver((items) => {
    items.forEach((i) => { if (i.isIntersecting) i.target.classList.add("show"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const canvas = document.getElementById("world");
  const hero = document.getElementById("hero");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 200);
  scene.add(new THREE.AmbientLight(0x9eb6ff, .32));
  scene.add(new THREE.PointLight(0xfff1c8, 2.3, 60));

  const starsG = new THREE.BufferGeometry();
  const starPos = new Float32Array(1500);
  for (let i = 0; i < 1500; i++) starPos[i] = (Math.random() - .5) * 80;
  starsG.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starsG, new THREE.PointsMaterial({ color: 0xcfe0ff, size: .03 })));

  const sun = new THREE.Mesh(new THREE.SphereGeometry(.9, 28, 20), new THREE.MeshBasicMaterial({ color: 0xffd27a }));
  scene.add(sun);

  const data = [
    { r:2.1,s:.07,c:0xb8b8b8,v:1.7 },
    { r:2.9,s:.11,c:0xe6c36a,v:1.25 },
    { r:3.8,s:.13,c:0x6f8cff,v:1 },
    { r:4.7,s:.1,c:0xc37a58,v:.8 },
    { r:6.4,s:.3,c:0xd7b07a,v:.46 },
    { r:8.1,s:.26,c:0xe7d4a6,v:.34,ring:true },
    { r:9.6,s:.17,c:0x9fd6e4,v:.23 },
    { r:11,s:.16,c:0x4d6dff,v:.18 }
  ];
  const worlds = data.map((p) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.SphereGeometry(p.s, 14, 12), new THREE.MeshStandardMaterial({ color:p.c, roughness:.55 }));
    m.position.x = p.r; g.add(m);
    if (p.ring) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(p.s * 1.8, .02, 8, 36), new THREE.MeshStandardMaterial({ color:0xd9c89a }));
      ring.rotation.x = Math.PI / 2.4; ring.position.x = p.r; g.add(ring);
    }
    const orbit = new THREE.Mesh(new THREE.RingGeometry(p.r-.01, p.r+.01, 64), new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:.1, side:THREE.DoubleSide }));
    orbit.rotation.x = Math.PI / 2; scene.add(orbit); scene.add(g);
    return { g, v:p.v };
  });

  const A = new THREE.Vector3(0, 7.2, 24);
  const B = new THREE.Vector3(1.4, 2.4, 10);
  const C = new THREE.Vector3(3.2, 1.1, 3.2);
  const cam = A.clone();
  const look = new THREE.Vector3();
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  (function loop(){
    requestAnimationFrame(loop);
    const t = performance.now() / 1000;
    worlds.forEach((w) => { w.g.rotation.y = t * w.v * .35; });
    sun.rotation.y = t * .08;
    const p = Math.max(0, Math.min(1, scrollY / (innerHeight * 0.95)));
    const from = p < .5 ? A : B;
    const to = p < .5 ? B : C;
    const k = p < .5 ? p * 2 : (p - .5) * 2;
    cam.lerp(from.clone().lerp(to, k), .08);
    look.lerp(new THREE.Vector3(3.8 * Math.max(0, (p - .45) / .55), 0, 0), .08);
    camera.position.copy(cam);
    camera.lookAt(look);
    hero.classList.toggle("hide", p > .7);
    renderer.render(scene, camera);
  })();
