/**
 * Локално генериране на резюме без AI
 */

/**
 * Генерира кратко резюме от текст без AI
 * Взема първите 2-3 изречения и ги почиства
 */
export function localSummaryFrom(text: string, fallback: string = ''): string {
  const raw = (text || fallback || '').replace(/\s+/g, ' ').trim();
  if (!raw) return '';

  // Вземи 2-3 кратки изречения
  const sentences = raw.split(/(?<=[.!?])\s+/).slice(0, 3).join(' ');

  // Леко "стягане" - махни излишни части в началото
  const cleaned = sentences
    .replace(/^Вижте.*?:\s*/i, '')
    .replace(/^Повече.*?:\s*/i, '')
    .replace(/^Снимка:.*?\.?\s*/i, '')
    .replace(/^Източник:.*?\.?\s*/i, '')
    .replace(/^Автор:.*?\.?\s*/i, '')
    .trim();

  // Ако е твърде късо, допълни с още текст
  if (cleaned.length < 80) {
    const ext = raw.slice(0, 280);
    return (cleaned + ' ' + ext).slice(0, 500).trim();
  }

  return cleaned.slice(0, 500);
}

/**
 * Извлича ключови факти от текст (числа, проценти, барели и т.н.)
 */
export function extractKeyFacts(text: string): string[] {
  const t = (text || '').replace(/\s+/g, ' ');
  const facts: string[] = [];

  // Цени на петрол (Brent, WTI)
  const priceMatch = t.match(/(?:Brent|WTI)[^0-9$€£]*([\$€£]?\d+(?:\.\d+)?)/i);
  if (priceMatch) facts.push(`Цена: ${priceMatch[0]}`);

  // Проценти промяна
  const percentMatch = t.match(/([+-]?\d+(?:\.\d+)?)\s?%/);
  if (percentMatch) facts.push(`Промяна: ${percentMatch[1]}%`);

  // Барели
  const barrelMatch = t.match(/(\d+(?:\.\d+)?)\s?барел/i);
  if (barrelMatch) facts.push(`${barrelMatch[0]}`);

  // Цени на горива (лв/л, €/л)
  const fuelPriceMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:лв|€)\s*\/\s*л/i);
  if (fuelPriceMatch) facts.push(`Цена: ${fuelPriceMatch[0]}`);

  return facts.slice(0, 3);
}






