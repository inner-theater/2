// 农历数据：每年正月初一对应的阳历日期 [月, 日]
// 数据来源：香港天文台，覆盖 1900-2025
const LUNAR_NEW_YEAR = {
  1900: [1, 31], 1901: [2, 19], 1902: [2, 8], 1903: [1, 29], 1904: [2, 16],
  1905: [2, 4], 1906: [1, 25], 1907: [2, 13], 1908: [2, 2], 1909: [1, 22],
  1910: [2, 10], 1911: [1, 30], 1912: [2, 18], 1913: [2, 6], 1914: [1, 26],
  1915: [2, 14], 1916: [2, 3], 1917: [1, 23], 1918: [2, 11], 1919: [2, 1],
  1920: [2, 20], 1921: [2, 8], 1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
  1925: [1, 24], 1926: [2, 13], 1927: [2, 2], 1928: [1, 23], 1929: [2, 10],
  1930: [1, 30], 1931: [2, 17], 1932: [2, 6], 1933: [1, 26], 1934: [2, 14],
  1935: [2, 4], 1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
  1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5], 1944: [1, 25],
  1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
  1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
  1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
  1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
  1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
  1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
  1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
  1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29]
}

// 农历每月天数（月大30天，月小29天），每年约12-13个月
// 简化：近似的农历月长（平均29.5天）
const LUNAR_MONTH_DAYS = 29.53059

/**
 * 将农历日期转换为近似阳历日期
 * @param {number} year - 农历年
 * @param {number} month - 农历月 (1-12)
 * @param {number} day - 农历日 (1-30)
 * @returns {{ year: number, month: number, day: number }}
 */
export function lunarToSolar(year, month, day) {
  const newYear = LUNAR_NEW_YEAR[year]
  if (!newYear) {
    // 超出数据集，回退到近似
    return { year, month, day }
  }

  // 计算从农历正月初一到目标日期的天数
  let totalDays = 0
  for (let m = 1; m < month; m++) {
    totalDays += Math.round(LUNAR_MONTH_DAYS)
  }
  totalDays += (day - 1)

  // 从阳历正月初一开始加上天数
  const baseDate = new Date(year, newYear[0] - 1, newYear[1])
  const resultDate = new Date(baseDate.getTime() + totalDays * 86400000)
  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate()
  }
}

/**
 * 将阳历日期转换为农历
 * @returns {{ year: number, month: number, day: number, leap: boolean }}
 */
export function solarToLunar(year, month, day) {
  // 查找该阳历日期属于哪个农历年
  let lunarYear = year
  let newYearDate = LUNAR_NEW_YEAR[year]

  if (!newYearDate) {
    // 超出数据范围
    let found = false
    for (let y = year; y >= 1900; y--) {
      if (LUNAR_NEW_YEAR[y]) {
        lunarYear = y
        newYearDate = LUNAR_NEW_YEAR[y]
        found = true
        break
      }
    }
    if (!found) return { year, month, day, leap: false }
  }

  // 如果阳历日期在春节之前，属于上一个农历年
  const springDate = new Date(year, newYearDate[0] - 1, newYearDate[1])
  const targetDate = new Date(year, month - 1, day)

  if (targetDate < springDate) {
    lunarYear = year - 1
    newYearDate = LUNAR_NEW_YEAR[lunarYear]
    if (!newYearDate) {
      return { year: lunarYear, month: 1, day: 1, leap: false }
    }
  }

  const baseDate = new Date(lunarYear, newYearDate[0] - 1, newYearDate[1])
  const diffDays = Math.floor((targetDate - baseDate) / 86400000)

  if (diffDays < 0) {
    return { year: lunarYear, month: 1, day: 1, leap: false }
  }

  // 按每月29或30天推进
  const monthDays = [0, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30]
  let remaining = diffDays + 1 // 第1天 = 初1
  let lunarMonth = 1

  for (let m = 1; m <= 12; m++) {
    const daysInMonth = monthDays[m]
    if (remaining <= daysInMonth) {
      lunarMonth = m
      break
    }
    remaining -= daysInMonth
    lunarMonth = m
  }

  return {
    year: lunarYear,
    month: lunarMonth,
    day: Math.max(1, Math.min(remaining, 30)),
    leap: false
  }
}
