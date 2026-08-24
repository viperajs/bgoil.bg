#!/usr/bin/env python3
# Bundles the seven pages into one self-contained file for previewing as an Artifact.
# The real site stays seven separate pages; this only exists so the whole thing can be
# clicked through from a single URL. Run after tools/build-pages.py.
import io, os, re, base64, sys

SRC = 'bgoil-cinematic'
PREV_ASSETS = sys.argv[1] if len(sys.argv) > 1 else None   # folder of lighter stills
OUT = sys.argv[2] if len(sys.argv) > 2 else 'preview.html'
FILES = ['index.html','ceni.html','uslugi.html','hotel.html','serviz.html','vaprosi.html','kontakt.html']

def data_uri(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path,'rb').read()).decode())

def asset(name, mime):
    if PREV_ASSETS and os.path.exists(os.path.join(PREV_ASSETS, name)):
        return data_uri(os.path.join(PREV_ASSETS, name), mime)
    return data_uri(os.path.join(SRC, 'assets', name), mime)

pages, titles = {}, {}
for f in FILES:
    html = io.open(os.path.join(SRC, f), encoding='utf-8').read()
    pages[f] = re.search(r'(<main id="main".*?</main>)', html, re.S).group(1)
    titles[f] = re.search(r'<title>(.*?)</title>', html, re.S).group(1)

index = io.open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
nav = re.search(r'(<nav class="nav".*?</nav>)', index, re.S).group(1)
foot = re.search(r'(<footer class="foot".*?</footer>)', index, re.S).group(1)
chrome = re.search(r'(<div class="env".*?</div>\n<div class="motes"[^>]*></div>)', index, re.S).group(1)

css = io.open(os.path.join(SRC,'assets','site.css'), encoding='utf-8').read()
js  = io.open(os.path.join(SRC,'assets','site.js'),  encoding='utf-8').read()

for fn in os.listdir(os.path.join(SRC,'assets','fonts')):
    css = css.replace("url('fonts/%s')" % fn, "url('%s')" % data_uri(os.path.join(SRC,'assets','fonts',fn),'font/woff2'))
for img in ['hero-ending.jpg','nosht.jpg']:
    css = css.replace("url('%s')" % img, "url('%s')" % asset(img,'image/jpeg'))

# every page shows the same lighter cut of the film, so the preview opens fast on mobile data
js = re.sub(r"var VIDEO_URL = PHONE_CUT \? '[^']+' : '[^']+';",
            "var VIDEO_URL = '%s';" % asset('hero-phone.mp4','video/mp4'), js)
js = js.replace("var POSTER_URL = 'assets/hero-poster.jpg';",
                "var POSTER_URL = '%s';" % asset('hero-poster.jpg','image/jpeg'))
js = re.sub(r"var VIDEO_BYTES = PHONE_CUT \? \d+ : \d+;",
            "var VIDEO_BYTES = %d;" % os.path.getsize(os.path.join(SRC,'assets','hero-phone.mp4')), js)

# every picture is stored once and handed to each <img> at load, so a photograph used
# on three pages does not travel three times
IMGS = ['hero-poster.jpg','hero-ending.jpg','hotel.jpg','serviz.jpg','nosht.jpg']
body = ''
for f in FILES:
    m = pages[f]
    for img in IMGS:
        m = m.replace('src="assets/%s"' % img, 'data-img="%s"' % img)
        m = m.replace('assets/' + img, asset(img,'image/jpeg'))
    m = m.replace('<main id="main" tabindex="-1">', '<main tabindex="-1">')
    body += '<div class="pgwrap%s" data-page="%s">%s</div>\n' % (' on' if f == FILES[0] else '', f, m)
IMGMAP = '{' + ','.join('"%s":"%s"' % (i, asset(i,'image/jpeg')) for i in IMGS) + '}'

ROUTER = '''
<script>
(function(){
  var imgs = %s;
  [].forEach.call(document.querySelectorAll('[data-img]'), function(el){
    var u = imgs[el.getAttribute('data-img')];
    if(u) el.setAttribute('src', u);
  });
  var wraps = [].slice.call(document.querySelectorAll('.pgwrap'));
  var titles = %s;
  function show(page, push){
    var found = false;
    wraps.forEach(function(w){
      var on = w.getAttribute('data-page') === page;
      w.classList.toggle('on', on);
      if(on) found = true;
    });
    if(!found) return false;
    document.title = titles[page] || document.title;
    [].forEach.call(document.querySelectorAll('.navlinks a, .foot a'), function(a){
      a.classList.toggle('here', (a.getAttribute('href')||'') === page);
    });
    if(push) history.replaceState(null,'','#/' + page);
    window.scrollTo(0,0);
    document.body.classList.remove('leaving');
    return true;
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a');
    if(!a) return;
    var href = a.getAttribute('href') || '';
    if(a.target === '_blank' || !/\\.html$/.test(href)) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function(){ show(href, true); }, 240);
  });
  var start = (location.hash || '').replace('#/','');
  if(start) show(start, false);
})();
</script>
'''  % (IMGMAP, '{' + ','.join('"%s":"%s"' % (f, titles[f]) for f in FILES) + '}')

doc = ('<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       '<title>BG OIL Враца</title>\n'
       '<style>\n' + css + '\n.pgwrap{display:none}\n.pgwrap.on{display:block}\n</style>\n'
       + chrome + '\n' + nav + '\n' + body + foot
       + '\n<script>window.__BUNDLE=1;</script>\n<script>\n' + js + '\n</script>\n' + ROUTER)
io.open(OUT,'w',encoding='utf-8').write(doc)
print('%s  %.2f MB' % (OUT, len(doc.encode())/1048576))
