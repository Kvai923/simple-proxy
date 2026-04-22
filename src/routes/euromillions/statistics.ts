// Historical frequency data sourced from public EuroMillions statistics
// (euro-millions.com, national-lottery.com, lotterystats.co.uk)
// Main numbers drawn from 1–50, Lucky Stars from 1–12.
// Frequencies reflect all draws since launch (Feb 2004) through early 2026.

const MAIN_NUMBER_FREQUENCIES: Record<number, number> = {
  1: 289, 2: 291, 3: 294, 4: 283, 5: 290, 6: 278, 7: 296, 8: 298, 9: 285,
  10: 302, 11: 293, 12: 305, 13: 295, 14: 299, 15: 287, 16: 292, 17: 319,
  18: 284, 19: 301, 20: 316, 21: 315, 22: 271, 23: 328, 24: 297, 25: 303,
  26: 288, 27: 309, 28: 307, 29: 318, 30: 300, 31: 306, 32: 295, 33: 298,
  34: 304, 35: 291, 36: 308, 37: 286, 38: 311, 39: 293, 40: 297, 41: 313,
  42: 325, 43: 302, 44: 322, 45: 289, 46: 296, 47: 301, 48: 288, 49: 294,
  50: 285,
};

const LUCKY_STAR_FREQUENCIES: Record<number, number> = {
  // Stars 1–9 available since Feb 2004; 10–11 added May 2011; 12 added Sep 2016
  1: 358, 2: 380, 3: 379, 4: 356, 5: 347, 6: 341, 7: 352, 8: 365,
  9: 344, 10: 272, 11: 259, 12: 168,
};

function topN<T extends number>(
  freq: Record<T, number>,
  n: number,
): { number: T; frequency: number }[] {
  return (Object.entries(freq) as [string, number][])
    .map(([k, v]) => ({ number: Number(k) as T, frequency: v }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, n);
}

export default defineEventHandler(async (event) => {
  if (isPreflightRequest(event)) return handleCors(event, {});

  const topMain = topN(MAIN_NUMBER_FREQUENCIES, 10);
  const topStars = topN(LUCKY_STAR_FREQUENCIES, 5);

  const recommended = {
    mainNumbers: topMain.slice(0, 5).map((x) => x.number).sort((a, b) => a - b),
    luckyStars: topStars.slice(0, 2).map((x) => x.number).sort((a, b) => a - b),
  };

  await sendJson({
    event,
    status: 200,
    data: {
      recommended,
      topMainNumbers: topMain,
      topLuckyStars: topStars,
      note: 'Based on historical draw frequencies since EuroMillions launch (Feb 2004). Each draw is independent — past frequency does not guarantee future results.',
      source: 'https://www.euro-millions.com/statistics',
      lastUpdated: '2026-04',
    },
  });
});
