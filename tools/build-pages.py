#!/usr/bin/env python3
# Builds the BG OIL site: seven plain HTML pages sharing assets/site.css and assets/site.js.
# Run from the repo root:  python3 tools/build-pages.py
import io, os, re

OUT = 'bgoil-cinematic'
PAGES = [
    ('index.html',   'BG OIL · Враца · Отворено 0-24', 'BG OIL · Vratsa · Open 0-24',
     'BG OIL, Враца, бул. Мито Орозов 34. Гориво, магазин, автосервиз, хотел и автомивка. Отворено 24 часа.'),
    ('ceni.html',    'Цени · BG OIL', 'Prices · BG OIL',
     'Цените на горивата в BG OIL, Враца, и колко спестяваш с картата.'),
    ('uslugi.html',  'Услуги · BG OIL', 'Services · BG OIL',
     'Магазин 0-24, EasyPay, автосервиз, гуми, автомивка и камера за боядисване във Враца.'),
    ('hotel.html',   'Хотел · BG OIL', 'Hotel · BG OIL',
     'Хотел на бензиностанция BG OIL, Враца. Климатик, черни завеси, тих сън по всяко време.'),
    ('serviz.html',  'Автосервиз · BG OIL', 'Workshop · BG OIL',
     'Автосервиз BG OIL, Враца. Цената се казва преди работата. Части, гуми, джанти, автобои.'),
    ('vaprosi.html', 'Въпроси · BG OIL', 'Questions · BG OIL',
     'Отговори на въпросите, които клиентите ни задават най-често.'),
    ('kontakt.html', 'Контакт · BG OIL', 'Contact · BG OIL',
     'BG OIL, гр. Враца, бул. Мито Орозов 34. Телефони, работно време и маршрут.'),
]
NAV = [('ceni.html','Цени','Prices'), ('uslugi.html','Услуги','Services'),
       ('hotel.html','Хотел','Hotel'), ('serviz.html','Сервиз','Workshop'),
       ('vaprosi.html','Въпроси','FAQ'), ('kontakt.html','Контакт','Contact')]

def t(bg, en):
    return 'data-bg="%s" data-en="%s"' % (bg.replace('"','&quot;'), en.replace('"','&quot;'))

MARK = ('<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#FF3A32" fill-rule="evenodd" '
        'd="M16 3c0 0-9.4 11.7-9.4 16.9A9.4 9.4 0 0 0 25.4 19.9C25.4 14.7 16 3 16 3zm0 9c0 0 4.8 5.9 4.8 8.5'
        'a4.8 4.8 0 1 1-9.6 0C11.2 17.9 16 12 16 12z"/></svg>')

ARROW = '<svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 5h11M8.4 1.4 12.6 5l-4.2 3.6"/></svg>'

def head(title_bg, title_en, desc):
    return """<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{tbg}</title>
<meta name="description" content="{desc}">
<meta name="title-en" content="{ten}">
<meta name="theme-color" content="#060A18">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23060A18'/%3E%3Cpath fill='%23FF3A32' fill-rule='evenodd' d='M16 4c0 0-9 11.2-9 16.2A9 9 0 0 0 25 20.2C25 15.2 16 4 16 4zm0 8.6c0 0 4.6 5.6 4.6 8.1a4.6 4.6 0 1 1-9.2 0c0-2.5 4.6-8.1 4.6-8.1z'/%3E%3C/svg%3E">
<!-- DEPLOY STEP: patch og:url and og:image with the live absolute URL before zipping -->
<meta property="og:type" content="website">
<meta property="og:title" content="{tbg}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="REPLACE_WITH_LIVE_URL">
<meta property="og:image" content="REPLACE_WITH_LIVE_URL/assets/hero-ending.jpg">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/oswald-600-cyrillic.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/golos-text-400-cyrillic.woff2" crossorigin>
<link rel="stylesheet" href="assets/site.css">
</head>
<body data-title-bg="{tbg}">
<a class="skip" href="#main" {skip}>Към съдържанието</a>

<div class="promo" id="promo" hidden><span></span></div>
<div class="env" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>
<div class="motes" id="motes" aria-hidden="true"></div>

<nav class="nav" id="nav">
  <a class="brand" href="index.html">{mark}<b>BG OIL</b><i>0-24</i></a>
  <div class="navlinks">
{links}
  </div>
  <button class="langbtn" id="lang" type="button" aria-label="Смени езика / Change language"><b id="langA">BG</b> / <span id="langB">EN</span></button>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="mobmenu" aria-label="Меню">
    <span></span><span></span>
  </button>
</nav>

<div class="mobmenu" id="mobmenu" aria-label="Меню">
{mlinks}
  <div class="mmfoot">
    <a class="btn btn-primary" href="tel:+359878618640" data-c="phone.station" {callattr}>Обади се сега</a>
    <span class="chip" id="menuclock"></span>
  </div>
</div>
""".format(tbg=title_bg, ten=title_en, desc=desc, skip=t('Към съдържанието','Skip to content'), mark=MARK,
           links='\n'.join('    <a href="%s" %s>%s</a>' % (h, t(bg, en), bg) for h, bg, en in NAV),
           callattr=t('Обади се сега','Call us now'),
           mlinks='\n'.join(
               '  <a class="mm" href="%s"><span class="i">%02d</span><span %s>%s</span></a>' % (h, i, t(bg, en), bg)
               for i, (h, bg, en) in enumerate([('index.html','Начало','Home')] + NAV)))

FOOT = '''
<footer class="foot">
  <div class="footgrid">
    <div>
      <a class="brand" href="index.html" style="text-decoration:none">%s<b>BG OIL</b><i>0-24</i></a>
      <p class="slogan" %s>Качеството над всичко</p>
    </div>
    <div>
      <p class="fh" %s>Страниците</p>
      <ul>
%s
      </ul>
    </div>
    <div>
      <p class="fh" %s>Намери ни</p>
      <ul>
        <li><a href="https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8" target="_blank" rel="noopener" %s>бул. Мито Орозов 34, Враца</a></li>
        <li><a href="tel:+359878618640" data-c="phone.station" data-cpfx-bg="" data-cpfx-en="">+359 878 618 640</a></li>
        <li><a href="mailto:bgoil_3000@abv.bg" data-c="email">bgoil_3000@abv.bg</a></li>
      </ul>
    </div>
  </div>
  <div class="copy">
    <span>&copy; <span id="year"></span> BG OIL</span>
    <span %s>Враца · Отворено 24 часа</span>
  </div>
</footer>
<script src="assets/site.js"></script>
</body>
</html>
''' % (MARK, t('Качеството над всичко','Quality above all'), t('Страниците','Pages'),
       '\n'.join('        <li><a href="%s" %s>%s</a></li>' % (h, t(bg, en), bg) for h, bg, en in NAV),
       t('Намери ни','Find us'), t('бул. Мито Орозов 34, Враца','34 Mito Orozov Blvd, Vratsa'),
       t('Враца · Отворено 24 часа','Vratsa · Open 24 hours'))

def phero(kind, kick_bg, kick_en, h1_bg, h1_en, lede_bg, lede_en, art=None, extra=''):
    artblock = ('  <div class="pheroart" aria-hidden="true"><img src="assets/%s" alt=""></div>\n' % art) if art else ''
    line = '<span class="drawline" aria-hidden="true"></span>' if kind == 'plain' else ''
    return ('<section class="phero %s">\n%s  <div class="wrap">\n'
            '    <p class="kick" %s>%s</p>\n'
            '    <h1 %s>%s</h1>\n'
            '    <p class="lede" %s>%s</p>\n%s    %s\n  </div>\n</section>\n'
            ) % (kind, artblock, t(kick_bg, kick_en), kick_bg, t(h1_bg, h1_en), h1_bg,
                 t(lede_bg, lede_en), lede_bg, extra, line)

def ctaband(h_bg, h_en, p_bg, p_en, buttons):
    rows = '\n'.join('      <a class="btn %s" href="%s" %s>%s</a>' % (cls, href, t(bg, en), bg)
                     for cls, href, bg, en in buttons)
    return ('<section class="sec"><div class="wrap"><div class="cta-band reveal">\n'
            '    <h2 %s>%s</h2>\n    <p %s>%s</p>\n    <div class="row">\n%s\n    </div>\n'
            '</div></div></section>\n') % (t(h_bg, h_en), h_bg, t(p_bg, p_en), p_bg, rows)

HERO = io.open('tools/_hero.html', encoding='utf-8').read()

# ------------------------------------------------------------------ home
def page_index():
    teasers = [
        ('ceni.html', 'hero-ending.jpg', 'Цени', 'Prices',
         'Виж какво плащаш и колко пести картата. Всеки литър, по всяко време.',
         'See what you pay and what the card saves. Every litre, at any hour.'),
        ('uslugi.html', 'nosht.jpg', 'Услуги', 'Services',
         'Магазин, кафе, EasyPay, гуми, автомивка. Спираш веднъж и готово.',
         'Shop, coffee, EasyPay, tyres, car wash. Stop once and it is done.'),
        ('hotel.html', 'hotel.jpg', 'Хотел', 'Hotel',
         'Легло на 30 крачки от камиона. Климатик, черни завеси, тишина.',
         'A bed thirty steps from your truck. Air conditioning, blackout curtains, quiet.'),
        ('serviz.html', 'serviz.jpg', 'Автосервиз', 'Workshop',
         'Цената я казваме, преди да пипнем колата. Старата част ти я показваме.',
         'We tell you the price before we touch the car, and show you the old part.'),
        ('vaprosi.html', None, 'Въпроси', 'Questions',
         'Отворени ли сте наистина 24 часа? По-скъпо ли е? Отговорите са тук.',
         'Are you really open 24 hours? Is it dearer? The answers are here.'),
        ('kontakt.html', None, 'Контакт', 'Contact',
         'Три телефона, един адрес и маршрут до нас. Вдигаме по всяко време.',
         'Three phone numbers, one address and directions. We answer at any hour.'),
    ]
    cards = []
    for href, img, bg, en, pbg, pen in teasers:
        imgtag = (('<img src="assets/%s" alt="" loading="lazy" decoding="async">' % img) if img
                  else '<span class="wm" aria-hidden="true">' + MARK + '</span>')
        cards.append('''      <a class="teaser reveal" href="%s">%s
        <span class="tin">
          <span class="th" %s>%s</span>
          <span class="tp" %s>%s</span>
          <span class="go"><span %s>Виж</span>%s</span>
        </span>
      </a>''' % (href, imgtag, t(bg, en), bg, t(pbg, pen), pbg, t('Виж','Open'), ARROW))
    return HERO + '''
<section class="sec" id="kade">
  <div class="wrap">
    <div class="reveal">
      <p class="kick" %s>Всичко на едно място</p>
      <h2 class="h2" %s>Спираш веднъж. Готово е всичко.</h2>
      <p class="lede" %s>Гориво, топло кафе, чиста тоалетна, магазин, каса за сметки, сервиз, гуми, мивка и легло. Всяко от тях има своя страница по-долу.</p>
    </div>
    <div class="teasers">
%s
    </div>
  </div>
</section>

<section class="sec night" id="noshtna">
  <div class="nightbg" aria-hidden="true"></div>
  <div class="wrap" style="position:relative;z-index:2">
    <div class="reveal">
      <p class="kick" %s>Нощната смяна</p>
      <h2 class="h2" %s>Малките неща, заради които се връщат.</h2>
    </div>
    <div class="stds stag">
      <div class="std"><span class="glow" aria-hidden="true"></span><span class="n">01</span>
        <h3 %s>Чисти тоалетни. По всяко време.</h3></div>
      <div class="std"><span class="glow" aria-hidden="true"></span><span class="n">02</span>
        <h3 %s>Истинско кафе в три сутринта.</h3></div>
      <div class="std"><span class="glow" aria-hidden="true"></span><span class="n">03</span>
        <h3 %s>Светъл паркинг, на който оставяш колата спокойно.</h3></div>
    </div>
    <div class="strip stag">
      <div><p class="v"><span data-count="24">0</span></p><p class="l" %s>Часа отворено</p></div>
      <div><p class="v"><span data-c="discount">5</span> <span style="font-size:.5em" %s>цента</span></p><p class="l" %s>По-малко на литър</p></div>
      <div><p class="v"><span data-count="6">0</span></p><p class="l" %s>Услуги на едно място</p></div>
      <div><p class="v">365</p><p class="l" %s>Дни в годината</p></div>
    </div>
  </div>
</section>
''' % (t('Всичко на едно място','All in one place'),
       t('Спираш веднъж. Готово е всичко.','Stop once. Everything is done.'),
       t('Гориво, топло кафе, чиста тоалетна, магазин, каса за сметки, сервиз, гуми, мивка и легло. Всяко от тях има своя страница по-долу.',
         'Fuel, hot coffee, a clean toilet, a shop, a bill counter, a workshop, tyres, a wash and a bed. Each has its own page below.'),
       '\n'.join(cards),
       t('Нощната смяна','The night shift'),
       t('Малките неща, заради които се връщат.','The small things people come back for.'),
       t('Чисти тоалетни. По всяко време.','Clean toilets. At any hour.'),
       t('Истинско кафе в три сутринта.','Real coffee at three in the morning.'),
       t('Светъл паркинг, на който оставяш колата спокойно.','A lit car park where you leave the vehicle without worrying.'),
       t('Часа отворено','Hours open'), t('цента','cents'), t('По-малко на литър','Less per litre'),
       t('Услуги на едно място','Services in one stop'), t('Дни в годината','Days a year')
       ) + ctaband('Светло е. Заповядай.', 'The light is on. Come in.',
                   'Бул. Мито Орозов 34, Враца. Вдигаме телефона по всяко време на денонощието.',
                   '34 Mito Orozov Blvd, Vratsa. We answer the phone at any hour.',
                   [('btn-primary','tel:+359878618640','Обади се сега','Call us now'),
                    ('btn-ghost','kontakt.html','Контакти и маршрут','Contact and directions')])

# ------------------------------------------------------------------ prices
FUELS = [('Дизел','Diesel',1.171), ('Бензин А95','Petrol A95',1.171), ('Г П Б','LPG',0.537), ('AdBlue','AdBlue',0.608)]
DISCOUNT = 0.05          # 5 цента на литър с картата

def page_ceni():
    rows = []
    for i, (bg, en, pr) in enumerate(FUELS):
        rows.append('''    <div class="bigrow reveal" data-fuel="%d">
      <span class="nm" data-fuel-name %s>%s</span>
      <span class="was"><span %s>без карта</span> <span data-fuel-std>%.3f</span></span>
      <span class="now"><span data-fuel-card data-count="%.3f" data-dec="3">0.000</span><small data-cur-unit>&#8364;/л</small>
        <small class="bgn" data-fuel-bgn></small></span>
    </div>''' % (i, t(bg, en), bg, t('без карта','standard'), pr, pr - DISCOUNT))
    return phero('plain', 'Цени', 'Prices',
        'Цената я виждаш преди да спреш.', 'You see the price before you pull in.',
        'Без изненади на колонката. С картата на BG OIL плащаш {d} цента по-малко на литър. Всеки литър, по всяко време.',
        'No surprises at the pump. With the BG OIL card you pay {d} cents less per litre. Every litre, at any hour.'
    ) + '''
<section class="sec">
  <div class="wrap">
    <div class="bigboard">
%s
    </div>
    <p class="boardnote" %s>Ориентировъчни цени. Актуалните светят на таблото при входа.</p>
  </div>
</section>

<section class="sec holdsec">
  <div class="wrap">
    <div class="reveal" style="text-align:center">
      <p class="kick" style="justify-content:center" %s>Картата</p>
      <h2 class="h2" style="margin-left:auto;margin-right:auto;text-align:center" %s>Дръж и виж разликата.</h2>
      <p class="lede" style="margin-left:auto;margin-right:auto;text-align:center" %s>Задръж бутона. Литрите текат. Отляво плащаш без карта, отдясно с карта.</p>
    </div>
    <div class="holdstage">
      <div class="meter reveal">
        <p class="lab" %s>Без карта</p>
        <p class="val"><span id="sumStd">0.00</span> <span style="font-size:.45em;color:var(--text-secondary)" data-cur>&#8364;</span></p>
        <div class="bar"><i></i></div>
      </div>
      <button class="holdbtn" id="holdbtn" type="button" aria-describedby="holdhint">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle class="trk" cx="50" cy="50" r="46" fill="none" stroke-width="2"/>
          <circle class="prg" cx="50" cy="50" r="46" fill="none" stroke-width="2" stroke-linecap="round"
                  stroke-dasharray="289" style="stroke-dashoffset:var(--hd,289)"/>
        </svg>
        <span><span class="litres" id="litresHold">0</span><span %s>Дръж, за да заредиш</span></span>
      </button>
      <div class="meter card reveal">
        <p class="lab" %s>С карта на BG OIL</p>
        <p class="val"><span id="sumCard">0.00</span> <span style="font-size:.45em;color:var(--text-secondary)" data-cur>&#8364;</span></p>
        <div class="bar"><i></i></div>
      </div>
    </div>
    <p id="holdhint" class="sr" %s>Задръж бутона, за да напълниш резервоара и да видиш разликата в цената.</p>
    <div class="holdout" id="holdout">
      <p class="big"><span %s>50 литра.</span> <em><span %s>{d} цента на литър.</span></em> <span %s>Всеки път.</span></p>
      <p class="small" %s>Картата се взема на място за нула лева.</p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="reveal">
      <p class="kick" %s>Сметката</p>
      <h2 class="h2" %s>Колко ти спестява за година.</h2>
      <p class="lede" %s>Дръпни колкото литра зареждаш на месец. Останалото се смята само.</p>
    </div>
    <div class="calc reveal">
      <label for="litres" style="display:block">
        <span %s>Литра на месец</span>
        <span style="font-family:var(--display);font-size:34px;color:var(--text-primary);display:block;margin-top:6px">
          <span id="litresOut">120</span></span>
      </label>
      <input id="litres" type="range" min="20" max="600" step="10" value="120" aria-label="Литра на месец">
      <div class="calcout">
        <div><p class="l" style="font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)" %s>На месец</p>
          <p class="v"><span id="saveMonth">12.00</span> <span style="font-size:.45em" data-cur>&#8364;</span></p></div>
        <div class="save"><p class="l" style="font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)" %s>На година</p>
          <p class="v"><span id="saveYear">144.00</span> <span style="font-size:.45em" data-cur>&#8364;</span></p></div>
      </div>
    </div>
  </div>
</section>
''' % ('\n'.join(rows),
       t('Ориентировъчни цени. Актуалните светят на таблото при входа.','Indicative prices. The live ones are lit on the board at the entrance.'),
       t('Картата','The card'), t('Дръж и виж разликата.','Hold and see the difference.'),
       t('Задръж бутона. Литрите текат. Отляво плащаш без карта, отдясно с карта.','Hold the button down. The litres run. On the left you pay without the card, on the right with it.'),
       t('Без карта','Without the card'), t('Дръж, за да заредиш','Hold to fill'),
       t('С карта на BG OIL','With the BG OIL card'),
       t('Задръж бутона, за да напълниш резервоара и да видиш разликата в цената.','Hold the button to fill the tank and see the price difference.'),
       t('50 литра.','50 litres.'), t('{d} цента на литър.','{d} cents a litre.'), t('Всеки път.','Every time.'),
       t('Картата се взема на място за нула лева.','You pick the card up here, for nothing.'),
       t('Сметката','The sum'), t('Колко ти спестява за година.','What it saves you in a year.'),
       t('Дръпни колкото литра зареждаш на месец. Останалото се смята само.','Drag to the litres you buy in a month. The rest works itself out.'),
       t('Литра на месец','Litres a month'), t('На месец','A month'), t('На година','A year')
       ) + ctaband('Вземи картата на място.', 'Pick the card up here.',
                   'Не струва нищо и важи веднага. Кажи на касата, че я искаш.',
                   'It costs nothing and works immediately. Just ask at the counter.',
                   [('btn-primary','tel:+359878618640','Обади се: +359 878 618 640','Call: +359 878 618 640'),
                    ('btn-ghost','uslugi.html','Виж услугите','See the services')])

# ------------------------------------------------------------------ services
SERVICES = [
 ('shop','Магазин 0-24','Shop 0-24',
  'Кафе, храна, цигари, вода, всичко за път. Не затваряме нито нощем, нито на празник.',
  'Coffee, food, cigarettes, water, everything for the road. We close neither at night nor on holidays.',
  ['Топло кафе и закуска по всяко време','Студени напитки, вода, енергийни','Цигари и дребни стоки за път','Чиста тоалетна, отворена денонощно'],
  ['Hot coffee and a bite at any hour','Cold drinks, water, energy drinks','Cigarettes and small things for the road','A clean toilet, open around the clock']),
 ('pay','EasyPay каса','EasyPay counter',
  'Ток, вода, телефон, интернет, данъци и застраховки. Плащаш ги тук, когато ти е удобно.',
  'Electricity, water, phone, internet, taxes and insurance. Pay them here, when it suits you.',
  ['Сметки за ток, вода, телефон и интернет','Данъци и такси','Захранване на мобилни кредити','Застраховки'],
  ['Electricity, water, phone and internet bills','Taxes and fees','Mobile top-ups','Insurance']),
 ('wrench','Автосервиз и части','Workshop and parts',
  'Бърза диагностика и ясна цена, преди да започне работата. Оригинални или алтернативни части, ти избираш.',
  'Fast diagnosis and a clear price before any work starts. Original or alternative parts, you choose.',
  ['Диагностика и ремонт','Оригинални и алтернативни части','Показваме сменената част','Спешни ремонти с налични части'],
  ['Diagnosis and repair','Original and alternative parts','We show you the part we replaced','Emergency repairs with parts in stock']),
 ('tyre','Гуми и джанти','Tyres and rims',
  'Смяна, баланс и машинно изправяне на изкривени джанти с гаранция за праволинейност.',
  'Fitting, balancing and machine straightening of bent rims, with a guarantee they run true.',
  ['Смяна и баланс на гуми','Машинно изправяне на джанти','Модерна баланс машина','Гаранция за праволинейност'],
  ['Tyre fitting and balancing','Machine straightening of rims','A modern balancing machine','Guaranteed to run true']),
 ('wash','Автомивка на самообслужване','Self-service car wash',
  'Ти държиш пистолета и плащаш само колкото ползваш. Отворена, когато ти трябва.',
  'You hold the lance and pay only for what you use. Open when you need it.',
  ['Ти решаваш колко да измиеш','Плащаш на време, без излишно','Подходяща и за микробуси','Осветена през нощта'],
  ['You decide how much to wash','You pay by time, nothing wasted','Suitable for vans too','Lit at night']),
 ('paint','Автобои и камера под наем','Paints and booth for hire',
  'Бои и консумативи за локален ремонт или цялостно възстановяване, плюс камера за боядисване под наем.',
  'Paints and materials for a local repair or a full restoration, plus a spray booth for hire.',
  ['Автобои и консумативи','Камера за боядисване под наем','За локален или цялостен ремонт','За професионалисти'],
  ['Car paints and materials','A spray booth for hire','For a local or a full repair','For professionals']),
]

def page_uslugi():
    rows = []
    for i, (key, bg, en, dbg, den, lbg, lene) in enumerate(SERVICES, 1):
        lis = '\n'.join('            <li %s>%s</li>' % (t(a, b), a) for a, b in zip(lbg, lene))
        rows.append('''    <div class="idxrow reveal" data-key="%s">
      <span class="n">%02d</span>
      <h3 %s>%s</h3>
      <svg class="mk" viewBox="0 0 32 32" aria-hidden="true">%s</svg>
    </div>
    <div class="idxbody">
      <div class="in">
        <p %s>%s</p>
        <ul class="ulist">
%s
        </ul>
      </div>
    </div>''' % (key, i, t(bg, en), bg, MARKS[key], t(dbg, den), dbg, lis))
    return phero('', 'Услуги', 'Services',
        'Спираш веднъж. Готово е всичко.', 'Stop once. Everything is done.',
        'Шест неща под един покрив, на бул. Мито Орозов 34. Отвори всяко, за да видиш какво включва.',
        'Six things under one roof on Mito Orozov Blvd. Open any of them to see what it covers.',
        art='nosht.jpg'
    ) + '''
<section class="sec">
  <div class="wrap">
    <div class="idx">
%s
    </div>
  </div>
</section>
''' % '\n'.join(rows) + ctaband('Не си сигурен дали го правим?', 'Not sure whether we do it?',
        'Обади се и питай. По-бързо е от търсенето и отговаряме по всяко време.',
        'Call and ask. It is quicker than searching, and we answer at any hour.',
        [('btn-primary','tel:+359878618640','Станция: +359 878 618 640','Station: +359 878 618 640'),
         ('btn-ghost','tel:+359877141742','Сервиз: +359 87 714 1742','Workshop: +359 87 714 1742')])

MARKS = {
 'shop':'<path d="M4.5 13h23v13.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M4.5 13 7 6.6A1.5 1.5 0 0 1 8.4 5.6h15.2a1.5 1.5 0 0 1 1.4 1L27.5 13"/><path d="M12.5 28v-7.5h7V28"/>',
 'pay':'<rect x="3" y="8" width="26" height="17" rx="2.5"/><path d="M3 13.5h26"/><path d="M7 20h6"/>',
 'wrench':'<path d="M21.4 5.2a6.8 6.8 0 0 0-8.2 8.8L5.4 21.8a2.9 2.9 0 1 0 4.1 4.1l7.8-7.8a6.8 6.8 0 0 0 8.8-8.2l-3.8 3.8-3.8-1-1-3.8z"/>',
 'tyre':'<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="4.6"/><path d="M16 4v7.4M16 20.6V28M4 16h7.4M20.6 16H28"/>',
 'wash':'<path d="M5.5 25h21"/><path d="M7.5 25l2.2-6.4A1.5 1.5 0 0 1 11.1 17.5h9.8a1.5 1.5 0 0 1 1.4 1.1L24.5 25"/><circle cx="10.5" cy="26.5" r="1.5"/><circle cx="21.5" cy="26.5" r="1.5"/><path d="M10 6.5c0 0-1.8 2.4-1.8 3.6a1.8 1.8 0 0 0 3.6 0c0-1.2-1.8-3.6-1.8-3.6z"/><path d="M16 4.5c0 0-1.8 2.4-1.8 3.6a1.8 1.8 0 0 0 3.6 0c0-1.2-1.8-3.6-1.8-3.6z"/><path d="M22 6.5c0 0-1.8 2.4-1.8 3.6a1.8 1.8 0 0 0 3.6 0c0-1.2-1.8-3.6-1.8-3.6z"/>',
 'paint':'<rect x="10.5" y="12" width="8.5" height="15.5" rx="1.5"/><path d="M12.5 12V8.5h4.5V12"/><path d="M17 6.5h3"/><circle cx="23.5" cy="6" r="1"/><circle cx="26" cy="9" r="1"/>',
}

# ------------------------------------------------------------------ hotel
def page_hotel():
    amen = [('Климатик','Air conditioning','Хладно през лятото, топло през зимата.','Cool in summer, warm in winter.'),
            ('Черни завеси','Blackout curtains','Спиш и по обед, все едно е нощ.','Sleep at midday as if it were night.'),
            ('Тишина','Quiet','Стаите гледат встрани от колонките.','The rooms face away from the pumps.'),
            ('Паркинг пред прозореца','Parking under the window','Виждаш колата си от леглото.','You can see your vehicle from the bed.'),
            ('Баня в стаята','Private bathroom','Топла вода по всяко време.','Hot water at any hour.'),
            ('Магазинът е до теб','The shop is next door','Кафе и закуска на 30 крачки.','Coffee and breakfast thirty steps away.')]
    cells = '\n'.join('      <div class="reveal"><b %s>%s</b><span %s>%s</span></div>'
                      % (t(a, b), a, t(c, d), c) for a, b, c, d in amen)
    return phero('', 'Хотел', 'Hotel',
        'Легло на 30 крачки от камиона.', 'A bed thirty steps from your truck.',
        'Спиш, когато ти трябва сън, дори по обед. Стаята е тиха, климатизирана и с черни завеси, а колата ти стои пред прозореца.',
        'You sleep when you need sleep, even at midday. The room is quiet, air conditioned and blacked out, and your vehicle sits under the window.',
        art='hotel.jpg'
    ) + '''
<section class="sec">
  <div class="wrap">
    <div class="reveal">
      <p class="kick" %s>В стаята</p>
      <h2 class="h2" %s>Направена е за хора, които пътуват.</h2>
      <p class="lede" %s>Без излишни неща и без театър. Легло, тишина, топла вода и спокойствие за колата отвън. Точно каквото ти трябва, преди пак да тръгнеш.</p>
    </div>
    <div class="amen stag" style="margin-top:44px">
%s
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap split rev">
    <div class="shot reveal">
      <img src="assets/hotel.jpg" alt="" loading="lazy" decoding="async" width="1600" height="1200">
      <span class="chip tag" %s>Хотел · 0-24</span>
    </div>
    <div class="reveal">
      <p class="kick" %s>Резервация</p>
      <h2 class="h2" %s>Обади се и питай за тази вечер.</h2>
      <p class="lede" %s>Обикновено има свободна стая и без резервация. Един телефон стига, за да разбереш веднага.</p>
      <p class="roomstate" id="roomState" role="status"></p>
      <div class="callrow">
        <a class="btn btn-primary" href="tel:0878618625" data-c="phone.hotel" data-cpfx-bg="Хотел: " data-cpfx-en="Hotel: " %s>Хотел: 087 8618625</a>
      </div>
      <div class="strip" style="margin-top:34px">
        <div><p class="v" %s>0-24</p><p class="l" %s>Приемане</p></div>
        <div><p class="v" %s>Да</p><p class="l" %s>Място за камион</p></div>
      </div>
    </div>
  </div>
</section>
''' % (t('В стаята','In the room'),
       t('Направена е за хора, които пътуват.','Made for people who travel.'),
       t('Без излишни неща и без театър. Легло, тишина, топла вода и спокойствие за колата отвън. Точно каквото ти трябва, преди пак да тръгнеш.',
         'Nothing surplus and no theatre. A bed, quiet, hot water and peace of mind about the vehicle outside. Exactly what you need before setting off again.'),
       cells, t('Хотел · 0-24','Hotel · 0-24'), t('Резервация','Booking'),
       t('Обади се и питай за тази вечер.','Call and ask about tonight.'),
       t('Обикновено има свободна стая и без резервация. Един телефон стига, за да разбереш веднага.',
         'There is usually a room free even without booking. One phone call tells you straight away.'),
       t('Хотел: 087 8618625','Hotel: 087 8618625'),
       t('0-24','0-24'), t('Приемане','Check-in'), t('Да','Yes'), t('Място за камион','Room for a truck')
       ) + ctaband('Стая тази вечер?', 'A room tonight?',
                   'Звънни и питай. Ако има свободна, я запазваме за теб веднага.',
                   'Call and ask. If one is free we hold it for you on the spot.',
                   [('btn-primary','tel:0878618625','087 8618625','087 8618625'),
                    ('btn-ghost','kontakt.html','Как да стигнеш','How to get here')])

# ------------------------------------------------------------------ workshop
def page_serviz():
    steps = [('01','Диагностика','Diagnosis','Първо гледаме какво има. Без да сваляме нищо излишно.','First we find out what is actually wrong, without stripping anything needlessly.'),
             ('02','Цена','Price','Казваме ти колко струва и от какво е съставена сумата.','We tell you the cost and what makes it up.'),
             ('03','Твоето да','Your yes','Нищо не започва, докато не се съгласиш. Тук 140 не стават 270.','Nothing starts until you agree. Here 140 does not turn into 270.'),
             ('04','Работа','The work','Правим ремонта и ти показваме старата част в ръката си.','We do the repair and show you the old part in our hand.')]
    cards = '\n'.join('''    <div class="step">
      <div class="dot">%s</div>
      <h3 %s>%s</h3>
      <p %s>%s</p>
    </div>''' % (n, t(bg, en), bg, t(dbg, den), dbg) for n, bg, en, dbg, den in steps)
    return phero('split-art', 'Автосервиз', 'Workshop',
        'Цената я казваме, преди да пипнем колата.', 'We tell you the price before we touch the car.',
        'Най-честият страх в сервиза е сметката накрая. При нас редът е обърнат: първо знаеш, после решаваш.',
        'The commonest fear in a workshop is the bill at the end. Here the order is reversed: first you know, then you decide.',
        art='serviz.jpg'
    ) + '''
<section class="sec">
  <div class="wrap">
    <div class="reveal">
      <p class="kick" %s>Как работим</p>
      <h2 class="h2" %s>Четири стъпки, в този ред.</h2>
    </div>
    <div class="proc">
      <span class="track" aria-hidden="true"><i></i></span>
%s
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="shot reveal">
      <img src="assets/serviz.jpg" alt="" loading="lazy" decoding="async" width="1600" height="1200">
      <span class="chip tag" %s>Автосервиз</span>
    </div>
    <div class="reveal">
      <p class="kick" %s>Какво правим</p>
      <h2 class="h2" %s>От спешен ремонт до цяло възстановяване.</h2>
      <ul class="ulist">
        <li %s>Ти избираш оригинална или алтернативна част</li>
        <li %s>Гуми, баланс и машинно изправяне на джанти</li>
        <li %s>Автобои и камера за боядисване под наем</li>
        <li %s>Автомивка на самообслужване за финала</li>
        <li %s>Налични части за спешни ремонти</li>
      </ul>
      <div class="callrow">
        <a class="btn btn-primary" href="tel:+359877141742" data-c="phone.service" data-cpfx-bg="Сервиз: " data-cpfx-en="Workshop: " %s>Сервиз: +359 87 714 1742</a>
        <a class="btn btn-ghost" href="mailto:autoservice_1313@abv.bg" data-c="emailService">autoservice_1313@abv.bg</a>
      </div>
    </div>
  </div>
</section>
''' % (t('Как работим','How we work'), t('Четири стъпки, в този ред.','Four steps, in this order.'), cards,
       t('Автосервиз','Workshop'), t('Какво правим','What we do'),
       t('От спешен ремонт до цяло възстановяване.','From an emergency repair to a full restoration.'),
       t('Ти избираш оригинална или алтернативна част','You choose the original or the alternative part'),
       t('Гуми, баланс и машинно изправяне на джанти','Tyres, balancing and machine straightening of rims'),
       t('Автобои и камера за боядисване под наем','Car paints and a spray booth for hire'),
       t('Автомивка на самообслужване за финала','A self-service wash to finish'),
       t('Налични части за спешни ремонти','Parts in stock for emergency repairs'),
       t('Сервиз: +359 87 714 1742','Workshop: +359 87 714 1742')
       ) + ctaband('Кажи какво прави колата.', 'Tell us what the car is doing.',
                   'Опиши шума или проблема по телефона. Често още там става ясно какво е.',
                   'Describe the noise or the fault on the phone. Often that alone makes it clear.',
                   [('btn-primary','tel:+359877141742','+359 87 714 1742','+359 87 714 1742'),
                    ('btn-ghost','uslugi.html','Всички услуги','All services')])

# ------------------------------------------------------------------ questions
QA = [
 ('Мястото','The place', [
   ('Наистина ли сте отворени 24 часа?','Are you really open 24 hours?',
    'Да. Колонките, магазинът и EasyPay работят без прекъсване, включително на празници.',
    'Yes. The pumps, the shop and EasyPay run without a break, holidays included.'),
   ('Безплатен ли е паркингът?','Is the parking free?',
    'Да, за клиенти, и е осветен цяла нощ. Има място и за камион.',
    'Yes, for customers, and it is lit all night. There is room for a truck too.'),
   ('Има ли тоалетна през нощта?','Is there a toilet at night?',
    'Има, отворена е денонощно и се чисти редовно. Това е едно от нещата, за които държим.',
    'There is, open around the clock and cleaned regularly. It is one of the things we hold to.')]),
 ('Гориво и цени','Fuel and prices', [
   ('По-скъпо ли е при вас?','Is it more expensive here?',
    'Не. Цените ни вървят с тези на големите вериги, а с нашата карта плащаш {d} цента по-малко на литър.',
    'No. Our prices track the big chains, and with our card you pay {d} cents less per litre.'),
   ('Как се взема картата?','How do I get the card?',
    'Кажи на касата, че я искаш. Не струва нищо и важи от същото зареждане.',
    'Ask at the counter. It costs nothing and works from that same fill-up.'),
   ('Качествено ли е горивото?','Is the fuel good quality?',
    'Работим с доказани доставчици и държим на качеството. Ако имаш въпрос за конкретна доставка, питай на място.',
    'We work with proven suppliers and we hold to quality. If you have a question about a delivery, ask us here.')]),
 ('Хотел и сервиз','Hotel and workshop', [
   ('Мога ли да взема стая без резервация?','Can I get a room without booking?',
    'Обикновено да. Обади се на 087 8618625 и ти казваме веднага дали има свободна.',
    'Usually yes. Call 087 8618625 and we will tell you straight away if one is free.'),
   ('Ще ми кажете ли цената преди ремонта?','Will you tell me the price before the repair?',
    'Винаги. Първо диагностика, после цена, после твоето съгласие. Чак тогава започваме.',
    'Always. First the diagnosis, then the price, then your agreement. Only then do we start.'),
   ('Работите ли с алтернативни части?','Do you work with alternative parts?',
    'Да, и с оригинални. Казваме ти разликата в цената и решаваш ти.',
    'Yes, and with original ones. We tell you the price difference and you decide.')]),
]

def page_vaprosi():
    groups = []
    for gbg, gen, items in QA:
        qs = '\n'.join('''      <details class="qa">
        <summary %s>%s</summary>
        <p class="a" %s>%s</p>
      </details>''' % (t(q, qe), q, t(a, ae), a) for q, qe, a, ae in items)
        groups.append('''    <div class="qgroup reveal">
      <h2 %s>%s</h2>
      <div class="faq">
%s
      </div>
    </div>''' % (t(gbg, gen), gbg, qs))
    return phero('plain', 'Въпроси', 'Questions',
        'Това, което хората питат.', 'What people ask.',
        'Събрали сме въпросите, които чуваме най-често на касата и по телефона. Ако твоят го няма, обади се.',
        'These are the questions we hear most at the counter and on the phone. If yours is missing, call us.'
    ) + '<section class="sec"><div class="wrap">\n' + '\n'.join(groups) + '\n</div></section>\n' \
      + ctaband('Не намери отговора?', 'Did not find your answer?',
                'Обади се и питай направо. Отговаряме по всяко време на денонощието.',
                'Call and ask directly. We answer at any hour of the day or night.',
                [('btn-primary','tel:+359878618640','+359 878 618 640','+359 878 618 640'),
                 ('btn-ghost','kontakt.html','Всички контакти','All contacts')])

# ------------------------------------------------------------------ contact
def page_kontakt():
    cards = [('station','Станция','Station','+359 878 618 640','tel:+359878618640','Гориво, магазин, EasyPay','Fuel, shop, EasyPay'),
             ('hotel','Хотел','Hotel','087 8618625','tel:0878618625','Стаи и резервации','Rooms and bookings'),
             ('service','Сервиз','Workshop','+359 87 714 1742','tel:+359877141742','Ремонти, части, гуми','Repairs, parts, tyres')]
    cc = '\n'.join('''    <a class="ccard reveal" href="%s" data-c="phone.%s">
      <span class="who" %s>%s</span>
      <span class="num" data-c-num>%s</span>
      <span class="note" %s>%s</span>
    </a>''' % (href, key, t(bg, en), bg, num, t(nbg, nen), nbg) for key, bg, en, num, href, nbg, nen in cards)
    return phero('', 'Контакт', 'Contact',
        'Светло е. Заповядай.', 'The light is on. Come in.',
        'гр. Враца 3000, бул. Мито Орозов 34. Отворено 0-24, всеки ден от годината.',
        '34 Mito Orozov Blvd, Vratsa 3000. Open 0-24, every day of the year.',
        art='hero-ending.jpg'
    ) + '''
<section class="sec">
  <div class="wrap">
    <div class="ccards">
%s
    </div>

    <div class="cgrid" style="margin-top:56px">
      <div class="cinfo reveal">
        <dl>
          <div>
            <dt %s>Адрес</dt>
            <dd><a href="https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8" target="_blank" rel="noopener" data-c="address" %s>гр. Враца 3000, бул. Мито Орозов 34</a></dd>
          </div>
          <div>
            <dt %s>Работно време</dt>
            <dd data-c="hours" %s>Отворено 0-24, всеки ден от годината</dd>
          </div>
          <div>
            <dt %s>Поща</dt>
            <dd><a href="mailto:bgoil_3000@abv.bg" data-c="email">bgoil_3000@abv.bg</a></dd>
          </div>
          <div>
            <dt %s>Поща на сервиза</dt>
            <dd><a href="mailto:autoservice_1313@abv.bg" data-c="emailService">autoservice_1313@abv.bg</a></dd>
          </div>
        </dl>
        <div class="callrow" style="margin-top:30px">
          <a class="btn btn-ghost" href="https://maps.app.goo.gl/8KYkuhrDv4fAZLbn8" target="_blank" rel="noopener" %s>Виж маршрута</a>
        </div>
      </div>

      <form id="form" novalidate>
        <label><span %s>Име</span><input id="fName" name="name" type="text" autocomplete="name" required></label>
        <label><span %s>Телефон</span><input id="fPhone" name="phone" type="tel" autocomplete="tel" required></label>
        <label><span %s>Какво ти трябва?</span><textarea id="fMsg" name="message"></textarea></label>
        <button class="btn btn-primary" type="submit" %s>Изпрати запитване</button>
        <p class="ok" id="formok" role="status" %s>Готово. Отваря се пощата ти с попълнено съобщение. Ако бързаш, звънни на +359 878 618 640.</p>
        <p class="formnote" %s>Запитването тръгва от твоята поща към bgoil_3000@abv.bg. За бърз отговор се обади.</p>
      </form>
    </div>
  </div>
</section>
''' % (cc, t('Адрес','Address'), t('гр. Враца 3000, бул. Мито Орозов 34','34 Mito Orozov Blvd, Vratsa 3000, Bulgaria'),
       t('Работно време','Opening hours'), t('Отворено 0-24, всеки ден от годината','Open 0-24, every day of the year'),
       t('Поща','Email'), t('Поща на сервиза','Workshop email'), t('Виж маршрута','Get directions'),
       t('Име','Name'), t('Телефон','Phone'), t('Какво ти трябва?','What do you need?'),
       t('Изпрати запитване','Send enquiry'),
       t('Готово. Отваря се пощата ти с попълнено съобщение. Ако бързаш, звънни на +359 878 618 640.',
         'Done. Your mail app opens with the message filled in. If you are in a hurry, call +359 878 618 640.'),
       t('Запитването тръгва от твоята поща към bgoil_3000@abv.bg. За бърз отговор се обади.',
         'The enquiry goes from your own mailbox to bgoil_3000@abv.bg. For a fast answer, call.'))

BODIES = {'index.html':page_index, 'ceni.html':page_ceni, 'uslugi.html':page_uslugi,
          'hotel.html':page_hotel, 'serviz.html':page_serviz, 'vaprosi.html':page_vaprosi,
          'kontakt.html':page_kontakt}

if __name__ == '__main__':
    for fn, tbg, ten, desc in PAGES:
        body = BODIES[fn]()
        html = head(tbg, ten, desc) + '\n<main id="main" tabindex="-1">\n' + body + '</main>\n' + FOOT
        io.open(os.path.join(OUT, fn), 'w', encoding='utf-8').write(html)
        print('%-14s %6d bytes' % (fn, len(html.encode())))
