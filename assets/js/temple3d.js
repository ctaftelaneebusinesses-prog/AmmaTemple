/* Procedural 3D Dravidian temple kit: everything is generated in code (no photos of the building needed) */
const T3 = (() => {
  const flames = [];   // flickering lamp flames, animated by T3.tick()
  const bells = [];
  const deities = [];  // Amma shader materials (lamp flicker)

  function canvasTex(w, h, draw, rep) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    return t;
  }
  function noise(g, w, h, n, a) {
    for (let i = 0; i < n; i++) {
      g.fillStyle = Math.random() > .5 ? `rgba(255,240,215,${a * Math.random()})` : `rgba(20,12,4,${a * Math.random()})`;
      g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
    // weathering streaks
    for (let i = 0; i < 18; i++) {
      const x = Math.random() * w, gr = g.createLinearGradient(x, 0, x, h);
      gr.addColorStop(0, 'rgba(30,20,10,.18)'); gr.addColorStop(1, 'rgba(30,20,10,0)');
      g.fillStyle = gr; g.fillRect(x, 0, 2 + Math.random() * 6, h * Math.random());
    }
  }
  const retex = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; };

  /* Granite ashlar blocks */
  const stoneTex = (base = '#7a6a58', rep = [1, 1]) => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 26000, .22);
    g.strokeStyle = 'rgba(25,16,8,.55)'; g.lineWidth = 3;
    for (let y = 0; y <= h; y += 96) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
      for (let x = (y / 96 % 2) * 110; x < w; x += 220) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 96); g.stroke(); }
    }
  }, rep);

  /* Carved wall bay: pilasters, moulding and a deity niche (koshta) */
  const bayTex = (base, tall) => canvasTex(256, tall ? 384 : 192, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 9000, .2);
    const sh = 'rgba(15,8,2,.55)', hi = 'rgba(255,240,210,.18)';
    // pilasters
    [[8, 30], [w - 38, 30]].forEach(([x, pw]) => {
      g.fillStyle = hi; g.fillRect(x, 10, pw, h - 20);
      g.fillStyle = sh; g.fillRect(x + pw, 10, 5, h - 20);
      for (let y = 30; y < h - 20; y += 46) { g.fillStyle = sh; g.fillRect(x - 3, y, pw + 6, 4); }
      g.fillStyle = sh; g.fillRect(x - 6, 6, pw + 12, 8);
    });
    // niche with arch
    const nx = w / 2 - 34, ny = h * .3, nw = 68, nh = h * .55;
    g.fillStyle = 'rgba(10,6,2,.75)'; g.fillRect(nx, ny, nw, nh);
    g.beginPath(); g.arc(w / 2, ny, nw / 2, Math.PI, 0); g.fill();
    g.strokeStyle = hi; g.lineWidth = 4; g.beginPath(); g.arc(w / 2, ny - 4, nw / 2 + 8, Math.PI, 0); g.stroke();
    // carved figure silhouette
    g.fillStyle = base; g.globalAlpha = .9;
    g.beginPath(); g.arc(w / 2, ny + 8, 9, 0, 7); g.fill();
    g.beginPath(); g.ellipse(w / 2, ny + nh * .45, 14, nh * .32, 0, 0, 7); g.fill();
    g.fillRect(w / 2 - 24, ny + 26, 48, 6);
    g.globalAlpha = 1;
    // horizontal mouldings
    g.fillStyle = sh; g.fillRect(0, h - 10, w, 10); g.fillRect(0, 0, w, 5);
    g.fillStyle = hi; g.fillRect(0, h - 16, w, 5);
  });

  /* Polished granite floor */
  const floorTex = rep => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#2b231c'; g.fillRect(0, 0, w, h); noise(g, w, h, 20000, .12);
    g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 3;
    for (let i = 0; i <= w; i += 256) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
  }, rep);

  /* Rangoli / kolam (white rice-flour style, as drawn at temple entrances) */
  const kolamTex = () => canvasTex(1024, 1024, (g, w, h) => {
    g.translate(w / 2, h / 2); g.strokeStyle = 'rgba(245,240,230,.9)'; g.fillStyle = 'rgba(245,240,230,.9)'; g.lineWidth = 6;
    for (let ring = 1; ring <= 6; ring++) {
      const r = ring * 75, n = ring * 8;
      for (let i = 0; i < n; i++) {
        g.save(); g.rotate(i / n * Math.PI * 2); g.beginPath();
        g.moveTo(0, r - 50); g.quadraticCurveTo(26, r - 15, 0, r + 10); g.quadraticCurveTo(-26, r - 15, 0, r - 50); g.stroke(); g.restore();
      }
      g.beginPath(); g.arc(0, 0, r - 58, 0, Math.PI * 2); g.stroke();
    }
    for (let a = 0; a < 64; a++) { g.beginPath(); g.arc(Math.cos(a / 64 * 6.283) * 490, Math.sin(a / 64 * 6.283) * 490, 6, 0, 7); g.fill(); }
  });

  /* Carved ceiling slabs */
  const ceilTex = rep => canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#3a2f25'; g.fillRect(0, 0, w, h); noise(g, w, h, 6000, .2);
    g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 6; g.strokeRect(0, 0, w, h);
    g.translate(128, 128); g.strokeStyle = 'rgba(200,170,130,.25)'; g.lineWidth = 3;
    for (let i = 0; i < 16; i++) { g.save(); g.rotate(i / 16 * Math.PI * 2); g.beginPath(); g.ellipse(0, 52, 12, 36, 0, 0, 7); g.stroke(); g.restore(); }
    g.beginPath(); g.arc(0, 0, 22, 0, 7); g.stroke();
  }, rep);

  /* Old teak door with brass bosses */
  const doorTex = flip => canvasTex(256, 768, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#2a140a'); gr.addColorStop(.5, '#40200e'); gr.addColorStop(1, '#2a140a');
    g.fillStyle = gr; g.fillRect(0, 0, w, h); noise(g, w, h, 9000, .15);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) {
      const x = 18 + c * 114, y = 18 + r * 83;
      g.strokeStyle = 'rgba(0,0,0,.7)'; g.lineWidth = 6; g.strokeRect(x, y, 104, 72);
      g.strokeStyle = 'rgba(200,150,80,.25)'; g.lineWidth = 2; g.strokeRect(x + 4, y + 4, 96, 64);
      const b = g.createRadialGradient(x + 48, y + 32, 2, x + 52, y + 36, 16);
      b.addColorStop(0, '#fff0b0'); b.addColorStop(.4, '#c8962e'); b.addColorStop(1, '#4a3008');
      g.fillStyle = b; g.beginPath(); g.arc(x + 52, y + 36, 14, 0, 7); g.fill();
    }
    g.strokeStyle = '#a87a28'; g.lineWidth = 9; g.beginPath(); g.arc(flip ? 44 : w - 44, h * .5, 26, 0, 7); g.stroke();
  });

  const glowTex = canvasTex(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,235,180,1)'); gr.addColorStop(.25, 'rgba(255,170,60,.6)'); gr.addColorStop(1, 'rgba(255,110,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  });
  const flameTex = canvasTex(64, 128, (g) => {
    const gr = g.createRadialGradient(32, 92, 2, 32, 80, 50);
    gr.addColorStop(0, '#fffbe6'); gr.addColorStop(.3, '#ffd34d'); gr.addColorStop(.7, 'rgba(255,110,0,.6)'); gr.addColorStop(1, 'rgba(255,60,0,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(32, 4); g.bezierCurveTo(62, 70, 56, 124, 32, 124); g.bezierCurveTo(8, 124, 2, 70, 32, 4); g.fill();
  });

  const graniteT = stoneTex('#6f604f');
  const stuccoT = stoneTex('#a8927a');
  const mat = (t, rx = 1, ry = 1, rough = .92) => { const m = retex(t, rx, ry); return new THREE.MeshStandardMaterial({ map: m, bumpMap: m, bumpScale: .04, roughness: rough }); };
  const M = {
    granite: mat(graniteT, 2, 2),
    stucco: mat(stuccoT, 1, 1),
    gold: new THREE.MeshStandardMaterial({ color: 0xd9a441, metalness: .9, roughness: .3, emissive: 0x1a0d00 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xb08030, metalness: .85, roughness: .38 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x050302, roughness: 1 }),
    oil: new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: .3 }),
  };

  function glow(size = 1.2, op = .9) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: op }));
    s.scale.set(size, size, 1); return s;
  }
  function flame(size = .35) {
    const grp = new THREE.Group();
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    f.scale.set(size * .5, size, 1); f.position.y = size * .45;
    const halo = glow(size * 3, .5); halo.position.y = size * .4;
    grp.add(f, halo); flames.push({ f, halo, s: Math.random() * 10, size }); return grp;
  }

  /* Brass standing lamp (kuthu vilakku) */
  function standLamp(h = 1.4) {
    const g = new THREE.Group();
    const prof = [[0, 0], [.32, 0], [.3, .06], [.14, .12], [.06, .2], [.05, h * .4], [.1, h * .45], [.05, h * .5], [.045, h * .95], [.3, h], [.32, h + .05], [.06, h + .07], [.05, h + .3], [.1, h + .38], [0, h + .55]];
    const lathe = new THREE.Mesh(new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 24), M.brass);
    g.add(lathe);
    for (let i = 0; i < 5; i++) { const fl = flame(.2); const a = i / 5 * Math.PI * 2; fl.position.set(Math.cos(a) * .28, h + .05, Math.sin(a) * .28); g.add(fl); }
    return g;
  }
  /* Clay agal vilakku */
  function diya() {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [.1, .01], [.13, .06], [.12, .07]].map(p => new THREE.Vector2(p[0], p[1])), 14), new THREE.MeshStandardMaterial({ color: 0x6a3418, roughness: .95 }));
    const fl = flame(.16); fl.position.set(.09, .05, 0); g.add(b, fl); return g;
  }
  /* Hanging brass bell */
  function bell() {
    const g = new THREE.Group();
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1.4, 5), M.brass); chain.position.y = -.7;
    const body = new THREE.Mesh(new THREE.LatheGeometry([[0, .5], [.07, .48], [.1, .35], [.14, .12], [.24, 0], [.25, -.03]].map(p => new THREE.Vector2(p[0], p[1])), 20), M.brass);
    body.material = M.brass; body.position.y = -1.9;
    g.add(chain, body); bells.push({ g, s: Math.random() * 6 }); return g;
  }

  /* Dravidian pillar: alternating square blocks & octagonal sections, lotus capital, corbel */
  function pillar(h = 5.5) {
    const g = new THREE.Group(), m = M.granite;
    const add = (geo, y) => { const x = new THREE.Mesh(geo, m); x.position.y = y; x.castShadow = x.receiveShadow = true; g.add(x); };
    add(new THREE.BoxGeometry(1.15, .35, 1.15), .175);
    const usable = h - 1.6, seg = usable / 5;
    let y = .35;
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) add(new THREE.BoxGeometry(.82, seg, .82), y + seg / 2);
      else { add(new THREE.CylinderGeometry(.38, .38, seg, 8), y + seg / 2); }
      add(new THREE.BoxGeometry(.9, .06, .9), y + seg); y += seg;
    }
    add(new THREE.CylinderGeometry(.5, .32, .35, 16), y + .17);        // lotus capital
    add(new THREE.BoxGeometry(.9, .18, .9), y + .44);                  // abacus
    add(new THREE.BoxGeometry(1.9, .3, .62), y + .68);                 // pushpa-potika corbel
    [-1, 1].forEach(s => { const d = new THREE.Mesh(new THREE.BoxGeometry(.25, .3, .5), m); d.position.set(s * .82, y + .45, 0); g.add(d); });
    add(new THREE.BoxGeometry(1.15, .22, 1.15), y + .94);
    return g;
  }

  /* Pillared mandapam hall from z0 down to z1 (negative) */
  function mandapam(z0, z1, opt = {}) {
    const g = new THREE.Group(), W = opt.width || 9, H = opt.height || 6.2, len = z0 - z1, step = opt.step || 4;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, len), new THREE.MeshStandardMaterial({ map: floorTex([(W + 8) / 4, len / 4]), roughness: .18, metalness: .35 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, (z0 + z1) / 2); floor.receiveShadow = true; g.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, len), new THREE.MeshStandardMaterial({ map: ceilTex([(W + 8) / 3, len / 3]), roughness: .95 }));
    ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, (z0 + z1) / 2); g.add(ceil);
    [-1, 1].forEach(s => {
      const wm = new THREE.MeshStandardMaterial({ map: retex(bayTex('#5e5042', true), len / 3, 1), roughness: .95 });
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(len, H), wm);
      wall.rotation.y = -s * Math.PI / 2; wall.position.set(s * (W / 2 + 4), H / 2, (z0 + z1) / 2); g.add(wall);
      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.1, .55, len), M.granite); beam.position.set(s * W / 2, H - .27, (z0 + z1) / 2); g.add(beam);
      const beam2 = beam.clone(); beam2.position.x = s * (W / 2 + 2.6); g.add(beam2);
    });
    let lights = 0;
    for (let z = z0 - 1; z > z1 + 1; z -= step) {
      [-1, 1].forEach(s => {
        [W / 2, W / 2 + 2.6].forEach(x => { const p = pillar(H - .55); p.position.set(s * x, 0, z); g.add(p); });
        const dl = diya(); dl.position.set(s * (W / 2 - .75), .36, z + .55); g.add(dl);
      });
      const cross = new THREE.Mesh(new THREE.BoxGeometry(W, .45, .9), M.granite); cross.position.set(0, H - .23, z); g.add(cross);
      if ((z0 - z) % (step * 2) < step) { const b = bell(); b.position.set(0, H - .45, z - step / 2); g.add(b); }
      if (lights < (opt.maxLights || 5)) {
        const L = new THREE.PointLight(0xff9a40, 1.5, 13, 2); L.position.set(0, 3.2, z - step / 2); g.add(L); lights++;
      }
    }
    return g;
  }

  /* Miniature shrine for the parapet (kuta = square with dome, sala = oblong with barrel roof) */
  const kutaGeo = { body: new THREE.BoxGeometry(.55, .55, .55), dome: new THREE.SphereGeometry(.34, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), tip: new THREE.ConeGeometry(.07, .22, 6) };
  const salaGeo = { body: new THREE.BoxGeometry(1, .55, .55), roof: new THREE.CylinderGeometry(.3, .3, 1.02, 12) };
  function haraRow(g, w, d, y, m) {
    const place = (x, z, ry, kind) => {
      const o = new THREE.Group(); o.position.set(x, y, z); o.rotation.y = ry;
      const b = new THREE.Mesh(kind ? salaGeo.body : kutaGeo.body, m); b.position.y = .27; o.add(b);
      if (kind) { const r = new THREE.Mesh(salaGeo.roof, m); r.rotation.z = Math.PI / 2; r.position.y = .55; o.add(r); }
      else { const dm = new THREE.Mesh(kutaGeo.dome, m); dm.position.y = .55; o.add(dm); const t = new THREE.Mesh(kutaGeo.tip, M.gold); t.position.y = .95; o.add(t); }
      o.traverse(c => { c.castShadow = true; }); g.add(o);
    };
    const n = Math.max(3, Math.round(w / 1.25));
    for (let i = 0; i < n; i++) { const x = -w / 2 + .35 + i * (w - .7) / (n - 1), k = i === 0 || i === n - 1 ? 0 : i % 2; place(x, d / 2 - .3, 0, k); place(x, -d / 2 + .3, Math.PI, k); }
    const ns = Math.max(2, Math.round(d / 1.25));
    for (let i = 1; i < ns - 1; i++) { const z = -d / 2 + .35 + i * (d - .7) / (ns - 1); place(w / 2 - .3, z, Math.PI / 2, i % 2); place(-w / 2 + .3, z, -Math.PI / 2, i % 2); }
  }

  /* Rajagopuram: granite base storeys with a tall doorway, brick-and-stucco tiers, barrel-vault crown */
  function gopuram() {
    const g = new THREE.Group(), W = 17, D = 8, DW = 3.8, DH = 7, BH = 12;
    const sideW = (W - DW) / 2;
    const box = (w, h, d, x, y, z, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; g.add(b); return b; };
    // moulded plinth (adhisthana)
    [[W + 1.2, .5, D + 1.2, .25], [W + .8, .35, D + .8, .67], [W + .5, .3, D + .5, .99]].forEach(([w, h, d, y]) => box(w, h, d, 0, y, 0, M.granite));
    // two granite storeys with carved bays, split by the doorway
    const baseMat = side => new THREE.MeshStandardMaterial({ map: retex(bayTex('#6f604f', true), side / 2.4, 1), roughness: .92 });
    [-1, 1].forEach(s => {
      box(sideW, BH - 1.15, D, s * (DW / 2 + sideW / 2), 1.15 + (BH - 1.15) / 2, 0, [baseMat(D), baseMat(D), M.granite, M.granite, baseMat(sideW), baseMat(sideW)]);
      // projecting pilasters
      for (let k = 0; k < 3; k++) box(.4, BH - 1.6, .25, s * (DW / 2 + .5 + k * 2.4), 1.15 + (BH - 1.6) / 2, D / 2 + .1, M.granite);
    });
    box(DW, BH - DH - 1.15, D, 0, 1.15 + DH + (BH - DH - 1.15) / 2, 0, M.granite);
    box(W + .9, .45, D + .9, 0, 6.6, 0, M.granite);                   // mid cornice
    box(W + 1.1, .5, D + 1.1, 0, BH + .25, 0, M.granite);             // top cornice (kapota)
    // stone door jambs with brass lining
    [-1, 1].forEach(s => { box(.45, DH + .3, .5, s * (DW / 2 + .2), 1.15 + DH / 2, D / 2 + .15, M.granite); box(.08, DH, .52, s * (DW / 2 - .02), 1.15 + DH / 2, D / 2 + .15, M.brass); });
    box(DW + 1.3, .55, .55, 0, 1.15 + DH + .28, D / 2 + .15, M.granite);
    // doors
    const doors = [];
    [-1, 1].forEach(s => {
      const pivot = new THREE.Group(); pivot.position.set(s * DW / 2, 1.15, D / 2 - .15);
      const tex = new THREE.MeshStandardMaterial({ map: doorTex(s > 0), roughness: .7, metalness: .1 });
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(DW / 2, DH, .18), [M.oil, M.oil, M.oil, M.oil, tex, tex]);
      leaf.position.set(-s * DW / 4, DH / 2, 0); leaf.castShadow = true; pivot.add(leaf); g.add(pivot); doors.push({ pivot, s });
    });
    // steps
    for (let i = 0; i < 4; i++) box(DW + 4 - i * .6, .29, 1.5 - i * .3, 0, .145 + i * .29, D / 2 + 1.2 - i * .3, M.granite);

    // stucco tiers (talas)
    let y = BH + .5, w = W, d = D;
    const tiers = 8, th = 2.25;
    for (let i = 0; i < tiers; i++) {
      w = W - 1 - i * 1.25; d = D - .6 - i * .48;
      const tm = new THREE.MeshStandardMaterial({ map: retex(bayTex('#a28c72'), w / 2, 1), roughness: .95 });
      const sm = new THREE.MeshStandardMaterial({ map: retex(bayTex('#a28c72'), d / 2, 1), roughness: .95 });
      box(w, th - .5, d, 0, y + (th - .5) / 2, 0, [sm, sm, M.stucco, M.stucco, tm, tm]);
      box(w - .4, th - .5, .5, 0, y + (th - .5) / 2, d / 2 + .1, M.stucco);           // central projecting bay
      box(1, 1.2, .1, 0, y + .7, d / 2 + .36, M.dark);                                 // window opening
      box(w + .35, .28, d + .35, 0, y + th - .36, 0, M.stucco);                         // cornice
      haraRow(g, w, d, y + th - .22, M.stucco);
      y += th;
    }
    // crown: barrel vault (sala sikhara) with kirtimukha gable ends and kalasams
    const vw = w - .5;
    const vault = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, vw, 24), M.stucco);
    vault.rotation.z = Math.PI / 2; vault.position.y = y; vault.castShadow = true; g.add(vault);
    box(vw, .4, 2.7, 0, y - .2, 0, M.stucco);
    [-1, 1].forEach(s => {
      const gable = new THREE.Mesh(new THREE.TorusGeometry(1.5, .22, 8, 24, Math.PI), M.stucco); gable.rotation.y = Math.PI / 2; gable.position.set(s * vw / 2, y, 0); g.add(gable);
    });
    const kn = 7;
    for (let k = 0; k < kn; k++) {
      const x = -(vw - 1) / 2 + k * (vw - 1) / (kn - 1);
      const pot = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [.18, .02], [.28, .2], [.2, .38], [.08, .45], [.12, .5], [.04, .9], [0, 1.05]].map(p => new THREE.Vector2(p[0], p[1])), 16), M.gold);
      pot.position.set(x, y + 1.3, 0); g.add(pot);
    }
    return { group: g, doors, height: y + 2.4, frontZ: D / 2, depth: D };
  }

  /* Amma: the photo is turned into a 3D relief that emerges from the darkness of the sanctum,
     lit by flickering lamps — no frame, no hanging picture */
  function deity(src, h = 3.4, opt = {}) {
    const g = new THREE.Group();
    const tex = new THREE.TextureLoader().load(src, t => { const a = t.image.width / t.image.height; plane.scale.x = a / .7; });
    const uni = { map: { value: tex }, flick: { value: 1 }, depth: { value: opt.depth || .55 } };
    const m = new THREE.ShaderMaterial({
      uniforms: uni, transparent: true, depthWrite: false,
      vertexShader: `
        uniform sampler2D map; uniform float depth; varying vec2 vUv; varying float vD;
        void main(){
          vUv = uv;
          vec2 c = (uv - vec2(.5,.55)) * vec2(2.0,1.6);
          float dome = clamp(1.0 - dot(c,c), 0.0, 1.0);
          vec3 col = texture2D(map, uv).rgb;
          float lum = dot(col, vec3(.3,.5,.2));
          float d = dome * .8 + lum * .35 * dome;
          vD = d;
          vec3 p = position; p.z += d * depth;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
        }`,
      fragmentShader: `
        uniform sampler2D map; uniform float flick; varying vec2 vUv; varying float vD;
        void main(){
          vec4 t = texture2D(map, vUv);
          vec2 c = (vUv - vec2(.5,.5)) * vec2(2.0,2.0);
          float r = length(c * vec2(1.0, .82));
          float a = 1.0 - smoothstep(.62, 1.0, r);
          float light = (.75 + vD * .45) * flick;
          vec3 col = t.rgb * light * vec3(1.08, .96, .82);
          gl_FragColor = vec4(col, a);
        }`
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(h * .7, h, 90, 120), m);
    plane.userData.isDeity = true;
    g.add(plane);
    deities.push(uni);
    // granite peetham (pedestal)
    const ped = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [.95, 0], [.95, .12], [.8, .2], [.8, .4], [.95, .48], [.95, .58], [0, .58]].map(p => new THREE.Vector2(p[0], p[1])), 32), M.granite);
    ped.scale.set(h * .32, 1, .55); ped.position.set(0, -h / 2 - .55, .1); g.add(ped);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(.81, .81, .06, 32), M.gold); band.scale.set(h * .32, 1, .55); band.position.set(0, -h / 2 - .25, .1); g.add(band);
    // deepa prabhavali: brass arch of tiny lamps around Amma
    const archR = h * .55;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(archR, .05, 8, 48, Math.PI), M.brass); arch.position.set(0, -h * .12, -.15); g.add(arch);
    for (let i = 0; i <= 14; i++) {
      const a = i / 14 * Math.PI, fl = flame(.12);
      fl.position.set(Math.cos(a) * archR, -h * .12 + Math.sin(a) * archR, -.1); g.add(fl);
    }
    if (opt.lamps !== false) [-1, 1].forEach(s => { const l = standLamp(1.1); l.position.set(s * (h * .5 + .2), -h / 2 - .55, .6); g.add(l); });
    return g;
  }

  function tick(t) {
    flames.forEach(o => {
      const k = 1 + Math.sin(t * 13 + o.s) * .08 + Math.sin(t * 7.3 + o.s * 2) * .06;
      o.f.scale.y = o.size * k; o.halo.material.opacity = .4 + Math.sin(t * 9 + o.s) * .1;
    });
    bells.forEach(b => b.g.rotation.z = Math.sin(t * 1.2 + b.s) * .04);
    deities.forEach(u => u.flick.value = 1 + Math.sin(t * 8.3) * .03 + Math.sin(t * 13.1) * .025);
  }

  /* Dusk sky */
  function sky() {
    return canvasTex(16, 512, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#070a1c'); gr.addColorStop(.45, '#24193a'); gr.addColorStop(.68, '#6b3030'); gr.addColorStop(.82, '#c8652e'); gr.addColorStop(1, '#f0a35a');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
  }

  /* Cinematic renderer defaults */
  function renderer(canvas) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = .9;
    return r;
  }

  return { flames, glow, flame, standLamp, diya, bell, pillar, mandapam, gopuram, deity, kolamTex, stoneTex, floorTex, sky, tick, renderer, M };
})();
