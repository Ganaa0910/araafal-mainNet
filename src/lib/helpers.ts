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

export function utcToLocalTime(date: Date) {
  let utcDate = new Date(date);
  console.log("🚀 ~ file: helpers.ts:23 ~ utcToLocalTime ~ utcDate:", utcDate);

  let localDate = new Date();
  console.log(
    "🚀 ~ file: helpers.ts:26 ~ utcToLocalTime ~ localDate:",
    localDate,
  );

  // Get the time difference in minutes
  let timeDiff = localDate.getTimezoneOffset();

  // Convert the time difference from minutes to milliseconds
  timeDiff *= 60 * 1000;
  console.log(
    "🚀 ~ file: helpers.ts:33 ~ utcToLocalTime ~ timeDiff:",
    timeDiff,
  );

  // Subtract the time difference from the UTC date
  localDate = new Date(utcDate.getTime() - timeDiff);
  console.log(
    "🚀 ~ file: helpers.ts:37 ~ utcToLocalTime ~ localDate:",
    localDate,
  );

  return localDate;
}
