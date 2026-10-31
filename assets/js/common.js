/* Shared header, footer, Amma song switch, 3D temple hall background and effects for every page */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const PAGES = [
  ['index.html', 'Home'], ['about.html', 'About'], ['gallery.html', 'Gallery'],
  ['info.html', 'Visitor Info'], ['services.html', 'Services'], ['news.html', 'News & Events'], ['contact.html', 'Contact']
];
const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

/* ---------- Header & footer ---------- */
document.body.insertAdjacentHTML('afterbegin', `
<header class="site">
  <a href="index.html#home" class="brand"><span class="dot"></span>Sri Gangamma</a>
  <nav id="nav"><ul>${PAGES.map(([h, t]) => `<li><a href="${h === 'index.html' ? 'index.html#home' : h}" class="${h === here ? 'active' : ''}">${t}</a></li>`).join('')}</ul></nav>
  <div class="hdr-actions">
    <button class="song-toggle" id="musicBtn" title="Turn Amma song on / off"><span class="ic"><i class="ico" data-i="volOff"></i></span><span class="lbl">Song OFF</span></button>
    <button class="icon-btn" id="menuBtn" title="Menu">☰</button>
  </div>
</header>
<div class="toran"></div>
<canvas id="bg3d"></canvas>
<div class="lamp-vignette"></div>`);
document.body.insertAdjacentHTML('beforeend', `
<footer class="site">
  <div class="te">ఓం శ్రీ గంగమ్మ తల్లియే నమః</div>
  <div class="flinks">${PAGES.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
  <small>© 2026 Sri Gangamma Ammavari Temple, Kuppam · All rights reserved</small>
</footer>
<div id="toast"></div>
<audio id="song" loop preload="auto"><source src="assets/audio/amma-song.mp4" type="audio/mp4"></audio>`);
$('#menuBtn').onclick = () => $('#nav').classList.toggle('open');

/* ---------- Line icons (gold, no emojis) ---------- */
const ICONS = {
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  scroll: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/><path d="M8 7h8M8 11h6"/>',
  lamp: '<path d="M2.5 13h19c-1 4-4.8 6-9.5 6s-8.5-2-9.5-6z"/><path d="M12 3c1.7 2.1 2.6 3.5 2.6 5.2a2.6 2.6 0 0 1-5.2 0C9.4 6.5 10.3 5.1 12 3z"/><path d="M8.5 22h7M12 19v3"/>',
  dress: '<path d="M8 3l4 3 4-3 4 4-3 3v11H7V10L4 7z"/><path d="M7 14c3 1 7-1 10 1"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-2 4-2 5-1-1-2-3-2-5-3 3-6 6-6 10 0 4 3 7 7 7z"/><path d="M12 22c-2 0-3-1.5-3-3.5S11 15 12 13c1 2 3 3.5 3 5.5S14 22 12 22z"/>',
  flag: '<path d="M5 22V3"/><path d="M5 4h13l-3 4 3 4H5"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  lotus: '<path d="M12 21c-4.5 0-8.5-2.2-9.5-6.5 3.3 0 6.7 1.3 9.5 4.3 2.8-3 6.2-4.3 9.5-4.3-1 4.3-5 6.5-9.5 6.5z"/><path d="M12 18.8c-2.4-2.3-3.5-5.3-3.5-8.8 1.3.3 2.7 1.2 3.5 2.4.8-1.2 2.2-2.1 3.5-2.4 0 3.5-1.1 6.5-3.5 8.8z"/><path d="M12 12.4V4"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C10 6 10 3 12 2c2 1 2 4 0 7.5zM12 14.5c2 3.5 2 6.5 0 7.5-2-1-2-4 0-7.5zM9.5 12C6 14 3 14 2 12c1-2 4-2 7.5 0zM14.5 12c3.5-2 6.5-2 7.5 0-1 2-4 2-7.5 0z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  footwear: '<path d="M3 15c3 0 5-1 7-4l3 1c1 2 4 3 8 3v4H3z"/><path d="M3 17h18"/>',
  food: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
  train: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/><circle cx="9" cy="14" r=".8"/><circle cx="15" cy="14" r=".8"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  news: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 8.5a5 5 0 0 1 0 7M19 5.5a9 9 0 0 1 0 13"/>',
  mask: '<path d="M4 5c5 2 11 2 16 0v6c0 5-4 9-8 9s-8-4-8-9z"/><path d="M8 10h2M14 10h2M9 15c2 1.5 4 1.5 6 0"/>',
  pot: '<path d="M6 9h12l-1 9a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z"/><path d="M5 9h14"/><path d="M10 3c0 1 1 1 1 2.5M14 3c0 1-1 1-1 2.5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  volOn: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  volOff: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>'
};
function icon(name) { return `<svg class="svg-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`; }
$$('.ico[data-i]').forEach(el => el.innerHTML = icon(el.dataset.i));

/* ---------- Amma song: ON/OFF switch, remembered across pages ---------- */
const song = $('#song'), mBtn = $('#musicBtn');
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
};
function showSong(on) { mBtn.classList.toggle('on', on); mBtn.querySelector('.ic').innerHTML = icon(on ? 'volOn' : 'volOff'); mBtn.querySelector('.lbl').textContent = on ? 'Song ON' : 'Song OFF'; }
function playMusic() { store.set('music', 'on'); return song.play().then(() => showSong(true)).catch(() => {}); }
function pauseMusic() { song.pause(); showSong(false); store.set('music', 'off'); }
mBtn.onclick = () => song.paused ? playMusic() : pauseMusic();
song.addEventListener('loadedmetadata', () => { const t = +store.get('musicTime'); if (t && song.duration) song.currentTime = t % song.duration; });
addEventListener('pagehide', () => store.set('musicTime', song.currentTime));
if (store.get('music') === 'on') {
  playMusic().then(() => {
    if (!song.paused) return;
    // browser blocked autoplay: start on the first tap / key
    const go = e => { if (e.target.closest && e.target.closest('#musicBtn')) return; playMusic(); removeEventListener('pointerdown', go); removeEventListener('keydown', go); };
    addEventListener('pointerdown', go); addEventListener('keydown', go);
  });
}

/* ---------- Temple bell (Web Audio) ---------- */
let actx;
function bell(freq = 520, vol = .3) {
  actx = actx || new (window.AudioContext || window.webkitAudioContext)();
  actx.resume(); const t = actx.currentTime;
  [1, 2.76, 5.4, 8.93].forEach((m, i) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = freq * m;
    g.gain.setValueAtTime(vol / (i + 1), t); g.gain.exponentialRampToValueAtTime(.0001, t + 4 - i * .6);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 4);
  });
}

function petals(n) {
  const cols = ['#ff9a1a', '#ffc52e', '#e8641a', '#fff1c8'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div'); p.className = 'petal'; p.style.background = cols[i % 4];
    p.style.left = Math.random() * 100 + 'vw'; p.style.animationDuration = (4 + Math.random() * 4) + 's'; p.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(p); setTimeout(() => p.remove(), 10000);
  }
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 4000); }

/* ---------- 3D tilt, reveal, banner ---------- */
function bindTilt(root = document) {
  root.querySelectorAll('.tilt').forEach(el => {
    const max = +el.dataset.max || 8;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}
bindTilt();
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));
const banner = $('.banner .inner');
if (banner) addEventListener('scroll', () => { const y = scrollY; banner.style.transform = `translateY(${y * .3}px) rotateX(${Math.min(y * .05, 35)}deg)`; banner.style.opacity = 1 - y / 500; });

/* ---------- 3D temple hall behind every inner page: you walk down the mandapam as you scroll ---------- */
(function () {
  if (!window.THREE || !window.T3 || document.body.dataset.no3d !== undefined) return;
  const renderer = T3.renderer($('#bg3d'));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0402); scene.fog = new THREE.Fog(0x0c0402, 6, 34);
  const cam = new THREE.PerspectiveCamera(62, 1, .1, 80);
  const size = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
  size(); addEventListener('resize', size);
  scene.add(new THREE.HemisphereLight(0xffc890, 0x2a1206, .55));

  const STEP = 4, LEN = 64;
  const hall = T3.mandapam(4, -LEN, { step: STEP, maxLights: 6 }); scene.add(hall);
  // sanctum glow far away at the end of the hall
  const far = T3.glow(16, .7); far.position.set(0, 2.5, -LEN + 2); scene.add(far);
  if (window.GODS) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(16, 6.2, .6), T3.M.granite); back.position.set(0, 3.1, -LEN - .2); scene.add(back);
    const amma = T3.deity(GODS[0], 3.2); amma.position.set(0, 2.15, -LEN + .6); scene.add(amma);
  }

  let mx = 0, my = 0;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime();
    const max = Math.max(1, document.body.scrollHeight - innerHeight);
    const z = 2 - (scrollY / max) * (LEN - 14) + Math.sin(t * .4) * .1;
    cam.position.set(Math.sin(t * .2) * .25 + mx * .6, 2.1 - my * .3, z);
    cam.lookAt(mx * 3, 2.2 - my * 1.2, z - 8);
    T3.tick(t);
    renderer.render(scene, cam); requestAnimationFrame(loop);
  })();
})();
