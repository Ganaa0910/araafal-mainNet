const tokens = [
  { id: 1, ticker: "BTC", imagePath: "/bitcoin.svg" },
  { id: 2, ticker: "ORDI", imagePath: "/images/ordi.png" },
  { id: 3, ticker: "PSAT", imagePath: "/images/psat.png" },
  { id: 4, ticker: "SATS", imagePath: "/images/sats.png" },
  { id: 5, ticker: "TRAC", imagePath: "/images/trac.png" },
  { id: 6, ticker: "JOEM", imagePath: "/images/psat.png" },
];

export function getTokenImagePath(ticker: string) {
  const token = tokens.find((token) => {
    return token.ticker === ticker;
  });
  if (token) {
    return token.imagePath;
  } else {
    return "/bitcoin.svg";
  }
}

export function utcToLocalTime(unixDate: any) {
  if (!unixDate) {
    return "";
  }
  console.log(
    "🚀 ~ file: helpers.ts:25 ~ utcToLocalTime ~ dateUnix:",
    unixDate,
  );
  const now = new Date(unixDate);
  console.log("🚀 ~ file: helpers.ts:26 ~ utcToLocalTime ~ now:", now);
  const nowUtc = now.toUTCString();
  console.log("🚀 ~ file: helpers.ts:27 ~ utcToLocalTime ~ nowUtc:", nowUtc);

  return nowUtc;
}
