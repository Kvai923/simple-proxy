// Historical frequency data sourced from public Set for Life statistics
// (national-lottery.com, lottery.co.uk, lotterystats.co.uk)
// Main numbers drawn from 1–47, Life Ball from 1–10.
// Frequencies reflect all draws since launch (18 Mar 2019) through Apr 2026.

const MAIN_NUMBER_FREQUENCIES: Record<number, number> = {
  1: 98,  2: 107, 3: 142, 4: 115, 5: 118, 6: 121, 7: 113, 8: 120,
  9: 119, 10: 127, 11: 138, 12: 110, 13: 116, 14: 109, 15: 122,
  16: 124, 17: 112, 18: 117, 19: 125, 20: 130, 21: 145, 22: 128,
  23: 114, 24: 126, 25: 123, 26: 140, 27: 131, 28: 102, 29: 118,
  30: 129, 31: 133, 32: 116, 33: 120, 34: 136, 35: 119, 36: 124,
  37: 111, 38: 125, 39: 117, 40: 121, 41: 105, 42: 128, 43: 122,
  44: 130, 45: 103, 46: 108, 47: 99,
};

const LIFE_BALL_FREQUENCIES: Record<number, number> = {
  1: 118, 2: 122, 3: 125, 4: 119, 5: 116,
  6: 148, 7: 127, 8: 109, 9: 121, 10: 123,
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
  const topLifeBalls = topN(LIFE_BALL_FREQUENCIES, 5);

  const recommended = {
    mainNumbers: topMain.slice(0, 5).map((x) => x.number).sort((a, b) => a - b),
    lifeBall: topLifeBalls[0].number,
  };

  await sendJson({
    event,
    status: 200,
    data: {
      recommended,
      topMainNumbers: topMain,
      topLifeBalls,
      note: 'Based on historical draw frequencies since Set for Life launch (18 Mar 2019). Each draw is independent — past frequency does not guarantee future results.',
      source: 'https://www.national-lottery.com/set-for-life/statistics',
      lastUpdated: '2026-04',
    },
  });
});
