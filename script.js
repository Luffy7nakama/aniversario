/* ══════════════════════════════════════════════════════
   ANIVERSARIO — script.js

   👉 PARA PONER TU MÚSICA:
      Pon tu archivo de música en la misma carpeta
      y cambia "mi-cancion.mp3" por el nombre de tu archivo

   👉 PARA CAMBIAR LA CONTRASEÑA:
      Cambia "te amo" por la que quieras

   👉 PARA CAMBIAR LAS FRASES DE LAS FOTOS:
      Edita el array photoCaptions más abajo
══════════════════════════════════════════════════════ */

// ══ CONTRASEÑA ══════════════════════════════
const PASSWORD = "te amo";   // 👈 CAMBIA AQUÍ


// ══ MÚSICA ══════════════════════════════════
// Opción A: pon el nombre de tu archivo de música aquí
//           (el archivo debe estar en la misma carpeta)
const MUSIC_FILE = "music/hecha.mp3";  // 👈 Ej: "mi-cancion.mp3"   Deja vacío para usar la melodía automática

// ══ FRASES DE LAS FOTOS ═════════════════════
const photoCaptions = [
  "Nuestro momento favorito 💕",
  "Así te miro yo siempre 🌷",
  "Juntos para siempre ✨",
  "El mejor día junto a ti 💗",
  "Mi recuerdo más bonito 🌸",
  "Tú eres mi todo 💖",
  "Tú y yo contra el mundo 🌺",
  "El amor de mi vida ❤️"
];

// ════════════════════════════════════════════
// NO necesitas editar nada debajo de esta línea
// ════════════════════════════════════════════


// ── Partículas ambient ──
(function spawnAmbient(){
  const c = document.getElementById('ambient');
  const sym = ['🌷','💗','✨','🌸','💕','❤️','🌺','💖','✿','❀','🌼'];
  setInterval(() => {
    const p = document.createElement('div');
    p.className = 'ambient-p';
    p.textContent = sym[Math.floor(Math.random() * sym.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = (.6 + Math.random() * .9) + 'rem';
    p.style.animationDuration = (7 + Math.random() * 9) + 's';
    p.style.animationDelay = (Math.random() * 3) + 's';
    c.appendChild(p);
    setTimeout(() => p.remove(), 16000);
  }, 600);
})();

// ── Canvas estrellas de fondo ──
(function bgCanvas(){
  const cv = document.getElementById('bg-canvas');
  const ctx = cv.getContext('2d');
  let stars = [];
  function init(){
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    stars = [];
    for(let i = 0; i < 150; i++){
      stars.push({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: Math.random() * 1.6,
        a: Math.random(),
        da: .002 + Math.random() * .008,
        dir: Math.random() > .5 ? 1 : -1
      });
    }
  }
  function draw(){
    ctx.clearRect(0, 0, cv.width, cv.height);
    stars.forEach(s => {
      s.a += s.da * s.dir;
      if(s.a >= 1 || s.a <= 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,160,84,${s.a * .4})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  init(); draw();
  window.addEventListener('resize', init);
})();

// ── Contraseña ──
function checkPwd(){
  const v = document.getElementById('pwd').value.trim().toLowerCase();
  const e = document.getElementById('err');
  if(v === PASSWORD){
    document.getElementById('lock').classList.add('gone');
    showUnlockSplash();
  } else {
    e.textContent = '💔 Contraseña incorrecta, inténtalo de nuevo';
    document.getElementById('pwd').style.borderColor = '#e87898';
    setTimeout(() => {
      e.textContent = '';
      document.getElementById('pwd').style.borderColor = '';
    }, 2500);
  }
}

// ── Splash de bienvenida ──
function showUnlockSplash(){
  const splash = document.getElementById('unlock-splash');
  splash.classList.add('show');
  launchTulips(window.innerWidth / 2, window.innerHeight / 2, 80);
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.classList.remove('show', 'fade-out');
      const m = document.getElementById('main');
      m.classList.add('show');
      observeReveal();
      buildGallery();
      checkDateModal();
      autoPlayMusic();
    }, 600);
  }, 2800);
}

// ── Música ──
let audioCtx = null, musicPlaying = false, gainNode = null;
let customAudio = null;

function autoPlayMusic(){
  if(MUSIC_FILE && MUSIC_FILE !== ""){
    // Usar archivo de música propio
    customAudio = new Audio(MUSIC_FILE);
    customAudio.loop = true;
    customAudio.volume = 0.7;
    customAudio.play().catch(() => {});
    musicPlaying = true;
  } else {
    // Melodía automática
    buildSynthMusic();
  }
  updateMusicBar();
}

function buildSynthMusic(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = .18;
  gainNode.connect(audioCtx.destination);
  const notes = [261.6,293.7,329.6,349.2,392,440,493.9,523.3];
  const melody = [0,2,4,5,7,5,4,2,0,2,4,7,5,4,2,0,4,5,7,9,7,5,4,2];
  const dur = .5;
  let t = audioCtx.currentTime;
  function playMelody(){
    melody.forEach((ni, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[ni % notes.length];
      g.gain.setValueAtTime(0, t + i * dur);
      g.gain.linearRampToValueAtTime(.18, t + i * dur + .08);
      g.gain.linearRampToValueAtTime(0, t + i * dur + dur - .05);
      osc.connect(g); g.connect(gainNode);
      osc.start(t + i * dur); osc.stop(t + i * dur + dur);
    });
    t += melody.length * dur;
    setTimeout(playMelody, (melody.length * dur - 1) * 1000);
  }
  playMelody();
  musicPlaying = true;
}

function toggleMusic(){
  if(customAudio){
    if(musicPlaying){ customAudio.pause(); musicPlaying = false; }
    else { customAudio.play(); musicPlaying = true; }
  } else {
    if(!audioCtx){ buildSynthMusic(); musicPlaying = true; }
    else if(musicPlaying){ gainNode.gain.value = 0; musicPlaying = false; }
    else { gainNode.gain.value = .18; musicPlaying = true; }
  }
  updateMusicBar();
}

function updateMusicBar(){
  const bar = document.getElementById('music-bar');
  const lbl = document.getElementById('music-label');
  if(musicPlaying){
    bar.classList.remove('paused');
    lbl.textContent = '♫ Música';
  } else {
    bar.classList.add('paused');
    lbl.textContent = '♩ Pausado';
  }
}

// ── Botón Feliz Aniversario ──
function triggerAnniversary(){
  launchTulips(window.innerWidth / 2, window.innerHeight / 2, 65);
  setTimeout(() => document.getElementById('love-popup').classList.add('show'), 600);
}
function closePopup(){
  document.getElementById('love-popup').classList.remove('show');
}

// ── Botón mágico (última página) ──
function triggerMagic(){
  launchTulips(window.innerWidth / 2, window.innerHeight * 0.6, 120);
  launchTulips(window.innerWidth * 0.1, window.innerHeight * 0.5, 40);
  launchTulips(window.innerWidth * 0.9, window.innerHeight * 0.5, 40);
}

// ── Lanzar tulipanes ──
function launchTulips(cx, cy, count){
  const layer = document.getElementById('tulip-layer');
  const t = ['🌷','🌸','🌺','💮','🌼','🏵️','💕','💗','✨','🌻','❤️','💖'];
  for(let i = 0; i < count; i++){
    const el = document.createElement('div');
    el.className = 'tulip-p';
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 420;
    el.style.cssText = `
      left:${cx - 20}px; top:${cy}px;
      font-size:${1 + Math.random() * 2}rem;
      --vx:${Math.cos(angle) * dist}px;
      --vy:${(-150 + Math.random() * -450)}px;
      --rot:${-200 + Math.random() * 400}deg;
      animation-duration:${1.2 + Math.random() * 1.6}s;
      animation-delay:${Math.random() * .5}s;
    `;
    el.textContent = t[Math.floor(Math.random() * t.length)];
    layer.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

// ── Galería de fotos ──
function buildGallery(){
  const g = document.getElementById('gallery-grid');
  if(g.children.length > 0) return;
  for(let i = 0; i < 8; i++){
    const s = document.createElement('div');
    s.className = 'photo-slot';
    s.innerHTML = `
      <img id="pi${i}" alt="">
      <div class="ph-placeholder">
        <span class="ic">📷</span>
        <span>Agregar foto</span>
      </div>
      <div class="photo-caption"><span>${photoCaptions[i] || '💕'}</span></div>
      <input type="file" accept="image/*" onchange="loadPh(this,${i})">
    `;
    g.appendChild(s);
  }
}
function loadPh(inp, i){
  const f = inp.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = e => {
    const img = document.getElementById('pi' + i);
    img.src = e.target.result;
    img.classList.add('loaded');
    img.closest('.photo-slot').querySelector('.ph-placeholder').style.display = 'none';
  };
  r.readAsDataURL(f);
}

// ── Contador de tiempo ──
function checkDateModal(){
  const s = localStorage.getItem('aniDate3');
  if(!s){ document.getElementById('dateModal').classList.remove('hidden'); }
  else { updateDisp(s); startTick(new Date(s)); }
}
function saveDate(){
  const v = document.getElementById('startDate').value;
  if(!v){ alert('Elige una fecha 💕'); return; }
  localStorage.setItem('aniDate3', v);
  document.getElementById('dateModal').classList.add('hidden');
  updateDisp(v); startTick(new Date(v));
}
function resetDate(){
  localStorage.removeItem('aniDate3');
  document.getElementById('startDate').value = '';
  document.getElementById('dateModal').classList.remove('hidden');
}
function updateDisp(v){
  const d = new Date(v + 'T00:00:00');
  document.getElementById('date-display').textContent =
    d.toLocaleDateString('es-ES', {day:'numeric', month:'long', year:'numeric'});
}
let _tick;
function startTick(start){
  clearInterval(_tick);
  function update(){
    const now = new Date();
    const s = new Date(start);
    let yr = now.getFullYear() - s.getFullYear();
    let mo = now.getMonth() - s.getMonth();
    if(mo < 0){ yr--; mo += 12; }
    const tmp = new Date(s);
    tmp.setFullYear(tmp.getFullYear() + yr);
    tmp.setMonth(tmp.getMonth() + mo);
    const dy = Math.floor((now - tmp) / 864e5);
    document.getElementById('cy').textContent = yr;
    document.getElementById('cm').textContent = mo;
    document.getElementById('cd').textContent = dy;
    document.getElementById('ch').textContent = now.getHours();
    document.getElementById('cmin').textContent = String(now.getMinutes()).padStart(2,'0');
  }
  update(); _tick = setInterval(update, 10000);
}

// ── Scroll reveal ──
function observeReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(ents => {
    ents.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold: .1});
  els.forEach(el => io.observe(el));
}
