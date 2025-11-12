/**
 * Функции за проверка на релевантност на новини за горива
 */

// 🔹 силни ключови думи, които са задължителни
export const STRONG_FUEL = [
  'горива','гориво','бензин','дизел','nafta','petrol','fuel',
  'lpg','пропан-бутан','газстанция','бензиностанц','лукойл',
  'акциз','рафинер','petroleum','oil','brent','wti','суров петрол'
];

/**
 * Проверява дали статията е релевантна за горива
 * 
 * По-интелигентен филтър, който:
 * - Игнорира статии за вода, ВиК, заплати, политика, електроенергия и др.
 * - Оставя само тези, в които се споменават директно горива, бензин, дизел, петрол, акцизи и т.н.
 * - Дава приоритет на източници като Oilprice, Investor, Capital и Mediapool.
 */
export function isFuelRelevant(title = '', summary = '', link = ''): boolean {
  const text = `${title} ${summary}`.toLowerCase();

  const host = (() => { try { return new URL(link).hostname.replace(/^www\./, ''); } catch { return ''; } })();

  // 🔹 силни ключови думи, които са задължителни
  const STRONG = STRONG_FUEL;

  // 🔹 вторични (поддържащи) термини
  const RELATED = [
    'цени','котировки','пазар','barrel','нефт','търговия','energy market',
    'petrochemical','refinery','pipeline','доставка','склад','резерви'
  ];

  // 🔹 изключващи — политически/общи/вик/вода и т.н.
  const EXCLUDE = [
    'вода','вик','електро','енергия','солар','вятър','батерии',
    'заплата','минималн','борисов','герб','избори','политика','данък',
    'здраве','инфлация','социалн','икономик','строителств','екология','климат'
  ];

  const hasStrong = STRONG.some(k => text.includes(k));
  const hasRelated = RELATED.some(k => text.includes(k));
  const hasExclude = EXCLUDE.some(k => text.includes(k));

  // 🔸 whitelisted домейни (доверени за горива) - приемаме само ако има силна дума
  const WHITELIST = ['oilprice.com','investor.bg','mediapool.bg','capital.bg','dnevnik.bg','segabg.com'];
  if (WHITELIST.some(d => host.endsWith(d))) {
    return hasStrong;
  }

  // 🔸 допускане: трябва да има поне една силна дума
  if (!hasStrong) return false;
  
  // 🔸 изключваме ако има изключващи термини (но само ако не е whitelisted)
  if (hasExclude) return false;

  return true;
}

