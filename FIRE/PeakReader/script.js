import { puell_multiple } from './subScript/puell_multiple.js';
import { mvrv_zscore } from './subScript/mvrv_zscore.js';

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
    value: (await puell_multiple())?.response?.chart?.figure?.data?.[7]?.y?.at(
      -1
    ),
    isTop: (v) => v >= 3,
  },
  {
    name: '터미널 가격',
    link: 'https://www.bitcoinmagazinepro.com/charts/terminal-price/',
    desc: '고점은 검정+빨강 돌파 후 꺾임',
    value: '안닿음',
    isTop: (v) => false,
  },
  {
    name: 'mvrv z-score',
    link: 'https://www.bitcoinmagazinepro.com/charts/mvrv-zscore/',
    desc: '7 이상이면 고점 가능성',
    value: (await mvrv_zscore())?.response?.chart?.figure?.data?.[6]?.y?.at(-1),
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
