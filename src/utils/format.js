/**
 * Round a value to a given number of decimals
 * @param {Number} value Value to round.
 * @param {Number} decimals decimals to round to.
 * @return {Number} rounded number
 */
export function roundNumber(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

/**
 * Add commas to a number to make it look better
 * @param {Number} nStr to add commas to
 * @return {String} number with commas
 */
export function addCommas(nStr) {
  if (!nStr) {
    nStr = 0;
  }
  nStr = +nStr + "";
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1,$2");
  }
  return x1 + x2;
}

/**
 * @param {Number} number Number to format
 * @return {String} number with commas and M/B instaed of million / billion
 */
export function formatNumber(number, thousand = false) {
  if (!number) {
    number = 0;
  }
  if (number > 999999999) {
    number = roundNumber(number / 1000000000.0, 1);
    return `${addCommas(number)}B`;
  } else if (number > 999999) {
    number = roundNumber(number / 1000000.0, 1);
    return `${addCommas(number)}M`;
  } else if (number > 999 && thousand) {
    number = roundNumber(number / 1000.0, 1);
    return `${addCommas(number)}K`;
  }
  return addCommas(number);
}
