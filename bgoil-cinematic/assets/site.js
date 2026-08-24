(function(){
"use strict";

/* ================= language ================= */
var LANG = 'bg';
try{ var saved = localStorage.getItem('bgoil-lang'); if(saved === 'bg' || saved === 'en') LANG = saved; }catch(e){}

function applyLang(){
  document.documentElement.lang = LANG;
  var nodes = document.querySelectorAll('[data-bg]');
  for(var i=0;i<nodes.length;i++){
    var t = nodes[i].getAttribute(LANG === 'bg' ? 'data-bg' : 'data-en');
    if(t !== null) nodes[i].textContent = t;
  }
  document.getElementById('langA').textContent = LANG === 'bg' ? 'BG' : 'EN';
  document.getElementById('langB').textContent = LANG === 'bg' ? 'EN' : 'BG';
  var tEn = document.querySelector('meta[name="title-en"]');
  if(LANG === 'en' && tEn) document.title = tEn.getAttribute('content');
  else if(LANG === 'bg' && document.body.dataset.titleBg) document.title = document.body.dataset.titleBg;
  buildBoard(); buildServices(); buildFaq(); clockTick(); splitAllBands();
}
document.getElementById('lang').addEventListener('click', function(){
  LANG = LANG === 'bg' ? 'en' : 'bg';
  try{ localStorage.setItem('bgoil-lang', LANG); }catch(e){}
  applyLang();
});

/* ================= content data ================= */
var FUELS = [
  {bg:'Дизел', en:'Diesel', price:2.29},
  {bg:'Бензин А95', en:'Petrol A95', price:2.29},
  {bg:'Г П Б', en:'LPG', price:1.05},
  {bg:'AdBlue', en:'AdBlue', price:1.19}
];
var DISCOUNT = 0.10;

function buildBoard(){
  var el = document.getElementById('board'); if(!el) return;
  var html = '';
  for(var i=0;i<FUELS.length;i++){
    var f = FUELS[i];
    html += '<div class="row"><span class="fuel">' + (LANG==='bg'?f.bg:f.en) + '</span>' +
            '<span class="pstd">' + f.price.toFixed(2) + ' ' + (LANG==='bg'?'лв/л':'lv/l') + '</span>' +
            '<span class="card">' + (f.price - DISCOUNT).toFixed(2) + ' ' + (LANG==='bg'?'лв/л':'lv/l') + '</span></div>';
  }
  el.innerHTML = html;
}

var SVG_MARKS = {
  shop:'<path d="M4.5 13h23v13.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M4.5 13 7 6.6A1.5 1.5 0 0 1 8.4 5.6h15.2a1.5 1.5 0 0 1 1.4 1L27.5 13"/><path d="M12.5 28v-7.5h7V28"/><path d="M4.5 13h23"/>',
  pay:'<rect x="3" y="8" width="26" height="17" rx="2.5"/><path d="M3 13.5h26"/><path d="M7 20h6"/><path d="M22 20h3"/>',
  wrench:'<path d="M21.4 5.2a6.8 6.8 0 0 0-8.2 8.8L5.4 21.8a2.9 2.9 0 1 0 4.1 4.1l7.8-7.8a6.8 6.8 0 0 0 8.8-8.2l-3.8 3.8-3.8-1-1-3.8z"/>',
  tyre:'<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="4.6"/><path d="M16 4v7.4M16 20.6V28M4 16h7.4M20.6 16H28"/>',
  wash:'<path d="M5.5 25h21"/><path d="M7.5 25l2.2-6.4A1.5 1.5 0 0 1 11.1 17.5h9.8a1.5 1.5 0 0 1 1.4 1.1L24.5 25"/><circle cx="10.5" cy="26.5" r="1.5"/><circle cx="21.5" cy="26.5" r="1.5"/><path d="M10 6.5c0 0-1.8 2.4-1.8 3.6a1.8 1.8 0 0 0 3.6 0c0-1.2-1.8-3.6-1.8-3.6z"/><path d="M16 4.5c0 0-1.8 2.4-1.8 3.6a1.8 1.8 0 0 0 3.6 0c0-1.2-1.8-3.6-1.8-3.6z"/><path d="M22 6.5c0 0-1.8 2.4-1.8 3.6a1.8 1.8 0 0 0 3.6 0c0-1.2-1.8-3.6-1.8-3.6z"/>',
  paint:'<rect x="10.5" y="12" width="8.5" height="15.5" rx="1.5"/><path d="M12.5 12V8.5h4.5V12"/><path d="M17 6.5h3"/><circle cx="23.5" cy="6" r="1"/><circle cx="26" cy="9" r="1"/><circle cx="22.5" cy="10.5" r="1"/>'
};
function buildServices(){
  var el = document.getElementById('svcgrid'); if(!el) return;
  var items = [
    {k:'shop', bg:['Магазин 0-24','Кафе, храна, цигари, всичко за път. Не затваряме.'], en:['Shop 0-24','Coffee, food, cigarettes, everything for the road. We do not close.']},
    {k:'pay', bg:['EasyPay каса','Ток, вода, телефон, данъци. Плащаш ги тук, по всяко време.'], en:['EasyPay counter','Electricity, water, phone, taxes. Pay them here, at any hour.']},
    {k:'wrench', bg:['Автосервиз и части','Бърза диагностика, оригинални и алтернативни части.'], en:['Workshop and parts','Fast diagnosis, original and alternative parts.']},
    {k:'tyre', bg:['Гуми и джанти','Смяна, баланс и машинно изправяне на изкривени джанти.'], en:['Tyres and rims','Fitting, balancing and machine straightening of bent rims.']},
    {k:'wash', bg:['Автомивка на самообслужване','Ти държиш пистолета. Плащаш само колкото ползваш.'], en:['Self-service car wash','You hold the lance. You pay only for what you use.']},
    {k:'paint', bg:['Автобои и камера под наем','За професионалисти, които искат сами да контролират резултата.'], en:['Paints and booth for hire','For professionals who want to control the result themselves.']}
  ];
  var html = '';
  for(var i=0;i<items.length;i++){
    var it = items[i], txt = LANG==='bg' ? it.bg : it.en;
    html += '<article class="svc"><svg viewBox="0 0 32 32" aria-hidden="true">' + SVG_MARKS[it.k] + '</svg>' +
            '<h3>' + txt[0] + '</h3><p>' + txt[1] + '</p></article>';
  }
  el.innerHTML = html;
}

function buildFaq(){
  var el = document.getElementById('faq'); if(!el) return;
  var qa = [
    {bg:['Наистина ли сте отворени 24 часа?','Да. Колонките, магазинът и EasyPay работят без прекъсване, включително на празници.'],
     en:['Are you really open 24 hours?','Yes. The pumps, the shop and EasyPay run without a break, holidays included.']},
    {bg:['По-скъпо ли е при вас?','Не. Цените ни вървят с тези на големите вериги, а с нашата карта плащаш 10 ст. по-малко на литър.'],
     en:['Is it more expensive here?','No. Our prices track the big chains, and with our card you pay 10 stotinki less per litre.']},
    {bg:['Безплатен ли е паркингът?','Да, за клиенти, и е осветен цяла нощ. Има място и за камион.'],
     en:['Is the parking free?','Yes, for customers, and it is lit all night. There is room for a truck too.']},
    {bg:['Мога ли да взема стая без резервация?','Обикновено да. Обади се на 087 8618625 и ти казваме веднага дали има свободна.'],
     en:['Can I get a room without booking?','Usually yes. Call 087 8618625 and we will tell you straight away if one is free.']},
    {bg:['Качествено ли е горивото?','Работим с доказани доставчици и държим на качеството. Ако имаш въпрос за конкретна доставка, питай на място.'],
     en:['Is the fuel good quality?','We work with proven suppliers and we hold to quality. If you have a question about a delivery, ask us here.']}
  ];
  var html = '';
  for(var i=0;i<qa.length;i++){
    var t = LANG==='bg' ? qa[i].bg : qa[i].en;
    html += '<details class="qa"><summary>' + t[0] + '</summary><p class="a">' + t[1] + '</p></details>';
  }
  el.innerHTML = html;
}

/* ================= the hour rail + clock ================= */
(function buildRail(){
  var svg = document.getElementById('railsvg'); if(!svg) return;
  var H = 420, N = 24, s = '';
  for(var h=0; h<=N; h++){
    var y = 6 + (H - 12) * (h / N);
    var q = (h % 6 === 0);
    s += '<line class="tick' + (q ? ' q' : '') + '" data-h="' + h + '" x1="' + (q ? 0 : 4) + '" y1="' + y + '" x2="' + (q ? 12 : 10) + '" y2="' + y + '"/>';
  }
  s += '<rect class="marker" id="railmark" x="0" y="0" width="16" height="2" rx="1"/>';
  svg.innerHTML = s;
})();

function clockTick(){
  var d = new Date();
  var hh = String(d.getHours()).padStart(2,'0'), mm = String(d.getMinutes()).padStart(2,'0');
  var nowTxt = LANG === 'bg' ? ('СЕГА ' + hh + ':' + mm) : ('NOW ' + hh + ':' + mm);
  var openTxt = LANG === 'bg' ? 'ОТВОРЕНО' : 'OPEN';
  var rn = document.getElementById('railnow');
  if(rn) rn.innerHTML = nowTxt + ' · <b>' + openTxt + '</b>';
  var hud = document.getElementById('hudclock');
  if(hud) hud.innerHTML = nowTxt + ' · <b>' + openTxt + '</b>';
  var kick = document.getElementById('statickick');
  if(kick) kick.textContent = (LANG === 'bg' ? 'ВРАЦА · СЕГА Е ' + hh + ':' + mm + ' · ОТВОРЕНО' : 'VRATSA · IT IS ' + hh + ':' + mm + ' · OPEN');
  var ticks = document.querySelectorAll('#railsvg .tick');
  for(var i=0;i<ticks.length;i++){
    if(parseInt(ticks[i].getAttribute('data-h'),10) === d.getHours()) ticks[i].classList.add('now');
    else ticks[i].classList.remove('now');
  }
}
setInterval(clockTick, 30000);

var railMark = document.getElementById('railmark');
var lastMarkY = -1;
function pageOffset(){
  var d = document.documentElement;
  var t = d.getBoundingClientRect().top;
  return t < 0 ? -t : (window.scrollY || 0);
}
function updateRail(){
  if(!railMark) return;
  var doc = document.documentElement;
  var max = doc.scrollHeight - window.innerHeight;
  var p = max > 0 ? Math.min(1, Math.max(0, pageOffset() / max)) : 0;
  var y = Math.round(6 + (420 - 12) * p);
  if(y === lastMarkY) return;
  lastMarkY = y;
  railMark.setAttribute('transform', 'translate(0,' + (y - 1) + ')');
}

/* ================= band splitting ================= */
function rng(seed){ var s = seed >>> 0; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function splitLine(el, mode, spread, seed){
  var text = el.getAttribute(LANG === 'bg' ? 'data-bg' : 'data-en') || el.textContent;
  el.textContent = '';
  var sr = document.createElement('span');
  sr.className = 'sr'; sr.textContent = text;
  el.appendChild(sr);

  if(mode === 'blur'){
    var wrap = document.createElement('span');
    wrap.className = 'blurwrap'; wrap.setAttribute('aria-hidden','true');
    var soft = document.createElement('span'); soft.className = 'soft'; soft.textContent = text;
    var sharp = document.createElement('span'); sharp.className = 'sharp'; sharp.textContent = text;
    wrap.appendChild(soft); wrap.appendChild(sharp);
    el.appendChild(wrap);
    return;
  }

  var vis = document.createElement('span');
  vis.setAttribute('aria-hidden','true');
  var words = text.split(' ');
  var rand = rng(seed);
  for(var i=0;i<words.length;i++){
    var w = document.createElement('span');
    w.className = 'w';
    w.textContent = words[i] + (i < words.length - 1 ? ' ' : '');
    var th = (i / Math.max(1, words.length)) * spread + rand() * 0.05;
    w.style.setProperty('--th', th.toFixed(3));
    vis.appendChild(w);
  }
  el.appendChild(vis);
}

function splitAllBands(){
  var lines = document.querySelectorAll('.band .line');
  for(var i=0;i<lines.length;i++){
    var el = lines[i];
    var band = el.closest('.band');
    var spread = parseFloat(band.getAttribute('data-spread') || '0.3');
    splitLine(el, el.getAttribute('data-split'), spread, 9301 + i * 137);
  }
}

/* ================= the scrub hero ================= */
// A phone shows a 4:3 slice of this shot, so it gets a cut already framed that
// way at full resolution, rather than a wide cut with most of its pixels cropped
// off the sides. Same shot, same seconds, no wasted detail.
var PHONE_CUT = matchMedia('(orientation: portrait) and (max-width: 900px)').matches;
var VIDEO_URL = PHONE_CUT ? 'assets/hero-phone.mp4' : 'assets/hero-scrub.mp4';
var VIDEO_BYTES = PHONE_CUT ? 2016949 : 3068361;
var POSTER_URL = 'assets/hero-poster.jpg';

var stage = document.getElementById('stage');
var hero = document.getElementById('hero');
var video = document.getElementById('hero-video');
var posterLayer = document.getElementById('poster');
var ring = document.querySelector('.ringwrap .ring');
var ringwrap = document.getElementById('ringwrap');

var bandEls = [].slice.call(document.querySelectorAll('.band')).map(function(el){
  return { el: el, a: parseFloat(el.getAttribute('data-a')), b: parseFloat(el.getAttribute('data-b')),
           sub: el.querySelector('.sub'), cta: el.querySelector('.ctarow'), op: -1, k: -1, on: -1 };
});

var target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true, ticks = 0, scrolls = 0;
var seekBusy = false, pendingTime = null;
var heroInit = false, videoOk = false, scrubOn = false;
var loadK = 0, loadStart = 0, loadRamping = false;

function heroProgress(){
  if(!hero) return 0;
  var r = hero.getBoundingClientRect();
  var range = hero.offsetHeight - window.innerHeight;
  if(range <= 0) return 0;
  return Math.min(1, Math.max(0, -r.top / range));
}

function requestSeek(t){
  if(playMode) return;
  if(!video.duration || !videoOk) return;
  if(seekBusy){ pendingTime = t; return; }
  seekBusy = true;
  try{ video.currentTime = t; }catch(e){ seekBusy = false; }
}
if(video){
  video.addEventListener('seeked', function(){
    seekBusy = false;
    if(pendingTime !== null){ var t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', function(){ seekBusy = false; pendingTime = null; failVideo(); });
}

var smoothstep = function(p, e0, e1){
  var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
var clamp = function(v, lo, hi){ return Math.min(hi, Math.max(lo, v)); };

function updateCaptions(p){
  for(var i=0;i<bandEls.length;i++){
    var B = bandEls[i];
    var f = Math.min(0.055, (B.b - B.a) / 3);
    var inA = (i === 0) ? 1 : smoothstep(p, B.a, B.a + f);
    var outB = (i === bandEls.length - 1) ? 1 : (1 - smoothstep(p, B.b - f, B.b));
    var op = inA * outB;
    var k = clamp((p - B.a) / f, 0, 1);
    if(i === 0) k = Math.max(k, loadK);

    if(Math.abs(op - B.op) > 0.004){
      B.op = op;
      B.el.style.opacity = op.toFixed(3);
    }
    var onNow = op > 0.02 ? 1 : 0;
    if(onNow !== B.on){
      B.on = onNow;
      B.el.classList.toggle('on', onNow === 1);
    }
    if(Math.abs(k - B.k) > 0.008){
      B.k = k;
      B.el.style.setProperty('--k', k.toFixed(3));
      if(B.sub) B.el.style.setProperty('--ks', clamp((k - 0.55) * 3, 0, 1).toFixed(3));
      if(B.cta) B.el.style.setProperty('--kb', clamp((k - 0.72) * 3.4, 0, 1).toFixed(3));
    }
  }
}

function tick(now){
  if(!scrubOn){ rafId = null; lastTick = 0; return; }
  var dt = Math.min(100, now - (lastTick || now));
  lastTick = now;
  target = heroProgress();
  ticks++;
  var k = 0.16;
  shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));

  if(loadRamping){
    loadK = clamp((now - loadStart) / 900, 0, 1);
    if(loadK >= 1) loadRamping = false;
  }

  var settled = Math.abs(target - shown) < 0.0005 && !loadRamping;
  if(settled) shown = target;

  if(heroOnScreen) rafId = requestAnimationFrame(tick);
  else { rafId = null; lastTick = 0; }

  if(videoOk && video.duration) requestSeek(shown * video.duration);
  updateCaptions(shown);
  updateRail();
  navState();
}

function kick(){
  if(rafId === null && heroOnScreen && scrubOn) rafId = requestAnimationFrame(tick);
}
function onScroll(){
  scrolls++;
  target = heroProgress();
  kick();
  updateRail();
  navState();
}

function failVideo(){
  if(!stage) return;
  videoOk = false;
  stage.classList.add('video-failed');
  if(ringwrap) ringwrap.style.opacity = '0';
}

function loadHeroBlob(){
  // an embedded copy carries the clip inline: hand it straight to the element,
  // since some hosts refuse to play media from a blob url
  if(VIDEO_URL.slice(0,5) === 'data:'){
    return new Promise(function(res, rej){
      video.addEventListener('canplay', function(){
        primeVideo();
        stage.classList.add('video-ready');
        verifyScrub().then(function(diff){
          if(diff < 4) enablePlayMode();
          videoOk = true; seekBusy = false; pendingTime = null;
          target = heroProgress();
          requestSeek(target * video.duration);
          kick(); res();
        });
      }, { once:true });
      video.addEventListener('error', function(){ rej(new Error('media')); }, { once:true });
      if(ring) ring.style.setProperty('--ld', 0);
      video.src = VIDEO_URL;
      video.load();
    });
  }
  var ctrl = new AbortController();
  var watchdog = setTimeout(function(){ ctrl.abort(); }, 20000);
  return fetch(VIDEO_URL, { signal: ctrl.signal }).then(function(res){
    if(!res.ok || !res.body) throw new Error('no body');
    var total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
    var reader = res.body.getReader();
    var chunks = [], got = 0, lastRing = 0;
    function pump(){
      return reader.read().then(function(r){
        if(r.done){
          clearTimeout(watchdog);
          if(ring) ring.style.setProperty('--ld', 0);
          video.src = URL.createObjectURL(new Blob(chunks, {type:'video/mp4'}));
          video.load();
          video.addEventListener('canplay', function(){
            primeVideo();
            stage.classList.add('video-ready');
            verifyScrub().then(function(diff){
              if(diff < 4) enablePlayMode();
              videoOk = true;
              seekBusy = false; pendingTime = null;
              target = heroProgress();
              requestSeek(target * video.duration);
              kick();
            });
          }, { once:true });
          return;
        }
        clearTimeout(watchdog);
        watchdog = setTimeout(function(){ ctrl.abort(); }, 20000);
        chunks.push(r.value); got += r.value.length;
        var frac = Math.min(1, got / total), n = performance.now();
        if(n - lastRing > 100 || frac === 1){
          lastRing = n;
          if(ring) ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
        }
        return pump();
      });
    }
    return pump();
  });
}

var playMode = false;

/* Some phones, iOS Safari above all, will not repaint a paused video when its
   time is set. Rather than trust that, prove it: seek to two points that look
   nothing alike and compare the pixels. If the picture never changed, scrubbing
   is dead on this device, so play the clip instead. Motion either way. */
function verifyScrub(){
  try{
    var c = document.createElement('canvas'); c.width = 16; c.height = 9;
    var ctx = c.getContext('2d', { willReadFrequently:true });
    var grab = function(){ ctx.drawImage(video, 0, 0, 16, 9); return ctx.getImageData(0,0,16,9).data; };
    var seekTo = function(t){
      return new Promise(function(res){
        var t0 = setTimeout(fin, 1500);
        function fin(){ clearTimeout(t0); video.removeEventListener('seeked', fin); setTimeout(res, 70); }
        video.addEventListener('seeked', fin);
        try{ video.currentTime = t; }catch(e){ fin(); }
      });
    };
    return seekTo(0.05).then(function(){
      var a = grab();
      return seekTo(video.duration * 0.72).then(function(){
        var b = grab(), diff = 0;
        for(var i=0;i<a.length;i+=4) diff += Math.abs(a[i]-b[i]) + Math.abs(a[i+1]-b[i+1]) + Math.abs(a[i+2]-b[i+2]);
        return diff / (a.length / 4);
      });
    });
  }catch(e){ return Promise.resolve(999); }
}

function enablePlayMode(){
  if(playMode) return;
  playMode = true;
  video.loop = true;
  var go = function(){ try{ var pr = video.play(); if(pr && pr.catch) pr.catch(function(){}); }catch(e){} };
  go();
  window.addEventListener('touchstart', go, { passive:true, once:true });
  window.addEventListener('pointerdown', go, { once:true });
}

var primed = false;
function primeVideo(){
  if(primed || !video) return;
  primed = true;
  try{
    var pr = video.play();
    if(pr && pr.then) pr.then(function(){ video.pause(); }).catch(function(){ primed = false; });
    else video.pause();
  }catch(e){ primed = false; }
}
// a first touch always satisfies a browser that wanted a gesture before loading media
if(video) ['touchstart','pointerdown'].forEach(function(ev){
  window.addEventListener(ev, function once(){
    window.removeEventListener(ev, once);
    if(videoOk) primeVideo();
  }, { passive:true });
});

function initHeroOnce(){
  if(heroInit) return;
  heroInit = true;
  posterLayer.style.backgroundImage = "url('" + POSTER_URL + "')";
  var started = false;
  function start(){ if(started) return; started = true; loadHeroBlob().catch(failVideo); }
  var pi = new Image();
  pi.onload = start; pi.onerror = start;
  pi.src = POSTER_URL;
  setTimeout(start, 4000);
  loadStart = performance.now(); loadK = 0; loadRamping = true;
}

/* ---- the five static-hero gates, identical to the CSS ---- */
var GATES = ['(prefers-reduced-motion: reduce)'];
function enableScrub(){
  if(scrubOn) return;
  scrubOn = true;
  initHeroOnce();
  window.addEventListener('scroll', onScroll, { passive:true });
  document.addEventListener('scroll', onScroll, { passive:true, capture:true });
  for(var i=0;i<bandEls.length;i++){ bandEls[i].op = -1; bandEls[i].k = -1; bandEls[i].on = -1; }
  unpinFinalStates();
  target = heroProgress();
  updateCaptions(target);
  onScroll();
  kick();
}
function disableScrub(){
  if(!scrubOn) return;
  scrubOn = false;
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('scroll', onScroll, true);
  if(rafId !== null){ cancelAnimationFrame(rafId); rafId = null; }
}
function applyHeroMode(){
  var hit = false;
  for(var i=0;i<GATES.length;i++){ if(matchMedia(GATES[i]).matches){ hit = true; break; } }
  if(hit) disableScrub(); else enableScrub();
}
var MQLS = GATES.map(function(q){ return matchMedia(q); });
var HAS_HERO = !!(hero && stage && video);
if(HAS_HERO) MQLS.forEach(function(m){ m.addEventListener('change', applyHeroMode); });

if(hero){
  var io = new IntersectionObserver(function(es){
    heroOnScreen = es[0].isIntersecting;
    if(playMode && video){
      if(heroOnScreen){ try{ var pr = video.play(); if(pr && pr.catch) pr.catch(function(){}); }catch(e){} }
      else { try{ video.pause(); }catch(e){} }
    }
    if(heroOnScreen) kick();
  }, { threshold:0 });
  io.observe(hero);
}

/* ================= nav state ================= */
var navEl = document.getElementById('nav'), navSolid = false;
function navState(){
  var s = pageOffset() > 40;
  if(s !== navSolid){ navSolid = s; navEl.classList.toggle('solid', s); }
}
window.addEventListener('scroll', function(){ updateRail(); navState(); }, { passive:true });

/* ================= entrances ================= */
var revIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(!e.isIntersecting) return;
    e.target.classList.add('in');
    if(e.target.classList.contains('stag')){
      setTimeout(function(){ e.target.classList.add('done'); }, 1400);
    }
    revIO.unobserve(e.target);
  });
}, { threshold:0.16, rootMargin:'0px 0px -8% 0px' });
function armReveals(){
  document.querySelectorAll('.reveal:not(.in), .stag:not(.in)').forEach(function(el){ revIO.observe(el); });
}

/* ================= the hold moment ================= */
(function hold(){
  var btn = document.getElementById('holdbtn');
  if(!btn || !document.getElementById('litresHold')) return;
  var out = document.getElementById('holdout');
  var litresEl = document.getElementById('litresHold');
  var sumStd = document.getElementById('sumStd'), sumCard = document.getElementById('sumCard');
  var meters = document.querySelectorAll('.meter');
  var MAXL = 50, PRICE = 2.29;
  var p = 0, holding = false, raf = null, last = 0, lastPaint = -1;

  function paint(){
    if(Math.abs(p - lastPaint) < 0.004) return;
    lastPaint = p;
    var L = p * MAXL;
    litresEl.textContent = L.toFixed(0);
    sumStd.textContent = (L * PRICE).toFixed(2);
    sumCard.textContent = (L * (PRICE - DISCOUNT)).toFixed(2);
    btn.style.setProperty('--hd', Math.round(289 * (1 - p)));
    for(var i=0;i<meters.length;i++) meters[i].style.setProperty('--hp', p.toFixed(3));
  }
  function loop(now){
    var dt = Math.min(80, now - (last || now)); last = now;
    if(holding) p = Math.min(1, p + dt / 1900);
    else p = Math.max(0, p - dt / 1400);
    paint();
    if(p >= 1){ out.classList.add('lit'); }
    if((holding && p < 1) || (!holding && p > 0)) raf = requestAnimationFrame(loop);
    else { raf = null; last = 0; }
  }
  function down(e){ if(e.cancelable) e.preventDefault(); holding = true; if(raf === null) raf = requestAnimationFrame(loop); }
  function up(){ holding = false; if(raf === null) raf = requestAnimationFrame(loop); }

  btn.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  btn.addEventListener('keydown', function(e){ if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); down(e); } });
  btn.addEventListener('keyup', function(e){ if(e.key === ' ' || e.key === 'Enter'){ up(); } });

  window.__fillHold = function(){ p = 1; paint(); out.classList.add('lit'); };
  window.__unfillHold = function(){ if(p >= 1 && !holding){ /* left as completed */ } };
})();

/* ================= the form (mailto) ================= */
(function(){
  var f = document.getElementById('form');
  if(!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var n = document.getElementById('fName').value.trim();
    var ph = document.getElementById('fPhone').value.trim();
    var m = document.getElementById('fMsg').value.trim();
    if(!n || !ph){
      (n ? document.getElementById('fPhone') : document.getElementById('fName')).focus();
      return;
    }
    var subj = LANG === 'bg' ? 'Запитване от сайта' : 'Enquiry from the website';
    var body = (LANG === 'bg' ? 'Име: ' : 'Name: ') + n + '\n' +
               (LANG === 'bg' ? 'Телефон: ' : 'Phone: ') + ph + '\n\n' + m;
    document.getElementById('formok').classList.add('show');
    window.location.href = 'mailto:bgoil_3000@abv.bg?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });
})();

/* ================= motes ================= */
(function(){
  var box = document.getElementById('motes');
  if(!box) return;
  var r = rng(20260824), html = '';
  for(var i=0;i<14;i++){
    var left = (r() * 100).toFixed(2);
    var top = (58 + r() * 42).toFixed(2);
    var dur = (26 + r() * 22).toFixed(1);
    var del = (-r() * 40).toFixed(1);
    var red = r() > 0.62 ? ' red' : '';
    html += '<span class="mote' + red + '" style="left:' + left + '%;top:' + top + '%;animation-duration:' + dur + 's;animation-delay:' + del + 's"></span>';
  }
  box.innerHTML = html;
})();

/* ================= reduced motion, live in both directions ================= */
function pinToFinalStates(){
  document.querySelectorAll('.reveal, .stag').forEach(function(el){ el.classList.add('in','pinned'); });
  document.querySelectorAll('.band').forEach(function(el){
    el.classList.add('pinned');
    el.style.opacity = '1';
    el.style.setProperty('--k','1');
    el.style.setProperty('--ks','1');
    el.style.setProperty('--kb','1');
  });
  if(window.__fillHold) window.__fillHold();
  if(HAS_HERO) disableScrub();
}
function unpinFinalStates(){
  document.querySelectorAll('.pinned').forEach(function(el){ el.classList.remove('pinned'); });
  document.querySelectorAll('.band').forEach(function(el){
    el.style.removeProperty('opacity');
    el.style.removeProperty('--k');
    el.style.removeProperty('--ks');
    el.style.removeProperty('--kb');
  });
}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e){
  if(e.matches) pinToFinalStates();
  else if(HAS_HERO) applyHeroMode();
});

/* ================= tab visibility ================= */
document.addEventListener('visibilitychange', function(){
  document.body.classList.toggle('paused', document.hidden);
});

/* ================= a readout, only when the address ends in #debug ================= */
if(location.hash === '#debug'){
  var dbg = document.createElement('div');
  dbg.setAttribute('style','position:fixed;left:8px;top:64px;z-index:99;background:rgba(0,0,0,.86);'+
    'color:#7CFFB2;font:11px/1.5 ui-monospace,monospace;padding:9px 11px;border-radius:8px;'+
    'white-space:pre;pointer-events:none;max-width:92vw');
  document.body.appendChild(dbg);
  setInterval(function(){
    var r = hero ? hero.getBoundingClientRect() : {top:0};
    dbg.textContent =
      'in frame : ' + (window.top !== window.self) + '\n' +
      'viewport : ' + window.innerWidth + ' x ' + window.innerHeight + '\n' +
      'scrollY  : ' + Math.round(window.scrollY) + '   pageOffset ' + Math.round(pageOffset()) + '\n' +
      'hero top : ' + Math.round(r.top) + '   progress ' + heroProgress().toFixed(3) + '\n' +
      'scrubOn  : ' + scrubOn + '   onScreen ' + heroOnScreen + '\n' +
      'raf ticks: ' + ticks + '   scroll events ' + scrolls + '\n' +
      'video    : ' + (videoOk ? 'ready' : 'not ready') + '   playMode ' + playMode + '\n' +
      'time     : ' + (video && video.duration ? video.currentTime.toFixed(2) + ' / ' + video.duration.toFixed(2) : 'n/a') + '\n' +
      'stage    : ' + (stage ? stage.className : '-');
  }, 200);
}

/* ================= boot ================= */
document.getElementById('year').textContent = new Date().getFullYear();
applyLang();
armReveals();
if(HAS_HERO) applyHeroMode();
updateRail();
navState();
if(matchMedia('(prefers-reduced-motion: reduce)').matches) pinToFinalStates();
requestAnimationFrame(function(){ document.body.classList.add('ready'); });
})();

/* ============================================================
   PAGES. Everything below runs on every page of the site.
   ============================================================ */
(function(){
  "use strict";
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mark the tab you are on */
  var here = location.pathname.split('/').pop() || 'index.html';
  [].forEach.call(document.querySelectorAll('.navlinks a, .foot a'), function(a){
    var href = (a.getAttribute('href') || '').split('#')[0];
    if(href && href === here) a.classList.add('here');
  });

  /* leaving one page for another should feel like a move, not a blink */
  if(!reduce){
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a');
      if(!a) return;
      var href = a.getAttribute('href') || '';
      if(a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if(!/\.html$/.test(href.split('#')[0])) return;
      if(href.split('#')[0] === here) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function(){ location.href = href; }, 260);
    });
    window.addEventListener('pageshow', function(e){ if(e.persisted) document.body.classList.remove('leaving'); });
  }

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.25, rootMargin:'0px 0px -6% 0px' });
  [].forEach.call(document.querySelectorAll('.drawline, .proc'), function(el){
    if(reduce) el.classList.add('in'); else io.observe(el);
  });

  /* the services index: each row draws its own mark, then opens */
  var rows = [].slice.call(document.querySelectorAll('.idxrow'));
  if(rows.length){
    var drawIO = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var r = e.target;
        [].forEach.call(r.querySelectorAll('.mk path, .mk circle, .mk rect'), function(sh){
          var len = 200;
          try{ len = Math.ceil(sh.getTotalLength ? sh.getTotalLength() : 200); }catch(x){}
          sh.style.setProperty('--len', len);
        });
        requestAnimationFrame(function(){ r.classList.add('drawn'); });
        drawIO.unobserve(r);
      });
    }, { threshold:.4 });
    rows.forEach(function(r){
      if(reduce) r.classList.add('drawn'); else drawIO.observe(r);
      r.addEventListener('click', function(){
        var open = r.classList.contains('open');
        rows.forEach(function(o){ o.classList.remove('open'); });
        if(!open) r.classList.add('open');
      });
      r.setAttribute('tabindex','0');
      r.setAttribute('role','button');
      r.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); r.click(); } });
    });
    rows[0].classList.add('open');
  }

  /* the process steps light in turn as the connecting line fills */
  var proc = document.querySelector('.proc');
  if(proc){
    var steps = [].slice.call(proc.querySelectorAll('.step'));
    var pio = new IntersectionObserver(function(es){
      if(!es[0].isIntersecting) return;
      steps.forEach(function(s, i){ setTimeout(function(){ s.classList.add('lit'); }, reduce ? 0 : 260 + i * 320); });
      pio.disconnect();
    }, { threshold:.3 });
    pio.observe(proc);
  }

  /* what the card saves you, in your own numbers */
  var slider = document.getElementById('litres');
  if(slider){
    var perL = 0.10;
    var outM = document.getElementById('saveMonth'), outY = document.getElementById('saveYear'),
        outL = document.getElementById('litresOut');
    var paint = function(){
      var v = +slider.value;
      var pct = ((v - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty('--fill', pct.toFixed(1) + '%');
      outL.textContent = v;
      outM.textContent = (v * perL).toFixed(2);
      outY.textContent = (v * perL * 12).toFixed(2);
    };
    slider.addEventListener('input', paint);
    paint();
  }

  /* numbers that count up once, when you reach them */
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  if(nums.length){
    var nio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target, to = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-dec')|0);
        nio.unobserve(el);
        if(reduce){ el.textContent = to.toFixed(dec); return; }
        var t0 = performance.now(), dur = 1100;
        (function step(now){
          var k = Math.min(1, (now - t0) / dur);
          var e2 = 1 - Math.pow(1 - k, 3);
          el.textContent = (to * e2).toFixed(dec);
          if(k < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold:.6 });
    nums.forEach(function(n){ nio.observe(n); });
  }
})();
