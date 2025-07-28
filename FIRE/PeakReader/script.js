import { puell_multiple } from './subScript/puell_multiple.js';
import { mvrv_zscore } from './subScript/mvrv_zscore.js';
import { terminal_price } from './subScript/terminal_price.js';
import { fetchLatestAltIndex } from './subScript/alt_index.js';

const [terminalResult, puellResult, zscoreResult, altIndexResult] =
  await Promise.all([
    terminal_price(),
    puell_multiple(),
    mvrv_zscore(),
    fetchLatestAltIndex(),
  ]);

const altIndex = altIndexResult?.data || -1;

const term = terminalResult?.response?.chart?.figure?.data;

const btc_price = term?.[0]?.y?.at(-1) || -1;
const term_price = term?.[1]?.y?.at(-1) || -1;

let puell = puellResult?.response?.chart?.figure?.data?.[7]?.y?.at(-1);
puell = ((puell * 1000) | 0) / 1000;

let zscore = zscoreResult?.response?.chart?.figure?.data?.[6]?.y?.at(-1);
zscore = ((zscore * 1000) | 0) / 1000;

const data = [
  {
    name: '알트코인 인덱스',
    link: 'https://www.coinglass.com/pro/i/alt-coin-season',
    desc: '',
    value: -1,
    isTop: (v) => v >= 75, // 예시 기준
  },
  {
    name: '푸엘 멀티플',
    link: 'https://www.bitcoinmagazinepro.com/charts/puell-multiple/',
    desc: '평소 1~2에서 이동, 3 넘으면 고점',
    value: puell,
    isTop: (v) => v >= 3,
  },
  {
    name: '터미널 가격',
    link: 'https://www.bitcoinmagazinepro.com/charts/terminal-price/',
    desc: '고점은 검정(btc)+빨강(term) 돌파 후 꺾임',
    value:
      'term ( ' +
      ((term_price / 1000) | 0).toString() +
      'k ) ' +
      (term_price > btc_price ? '>' : '<=') +
      ' BTC ( ' +
      ((btc_price / 1000) | 0).toString() +
      'k )',
    isTop: (v) => term_price <= btc_price,
  },
  {
    name: 'mvrv z-score',
    link: 'https://www.bitcoinmagazinepro.com/charts/mvrv-zscore/',
    desc: '7 이상이면 고점 가능성',
    value: zscore,
    isTop: (v) => v >= 7,
  },
];

const table = document.getElementById('data-table');

data.forEach((item) => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${item.name}</td>
    <td><a href="${item.link}" target="_blank">링크</a></td>
    <td>${item.desc}</td>
    <td>${item.value}</td>
    <td>${item.isTop(item.value) ? '✔' : '✘'}</td>
  `;

  table.appendChild(row);
});
